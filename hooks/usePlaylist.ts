import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IPlaylist } from "@/interfaces/IPlaylist";

const usePlaylist = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPlaylists = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/playlist?userId=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const playlists = data as Array<IPlaylist>;
      const musicFilePromises = playlists.map((playlist) => {
        return playlist.musics.map((music) => getAWSSignedURL(music.musicFile));
      });
      const musicFileCompressedPromises = playlists.map((playlist) => {
        return playlist.musics.map((music) =>
          getAWSSignedURL(music.musicFileCompressed)
        );
      });
      const musicFiles = await Promise.all([
        ...musicFilePromises.map((promises) => Promise.all(promises)),
      ]);
      const musicFileCompresseds = await Promise.all([
        ...musicFileCompressedPromises.map((promises) => Promise.all(promises)),
      ]);
      musicFiles.map((files, index) => {
        files.map((file, indexFile) => {
          playlists[index].musics[indexFile].musicFile = file;
        });
      });
      musicFileCompresseds.map((files, index) => {
        files.map((file, indexFile) => {
          playlists[index].musics[indexFile].musicFileCompressed = file;
        });
      });
      const result: Array<IPlaylist> = [];
      playlists.map((playlist) => {
        if (user.id != playlist.creator.id) {
          result.push(playlist);
        }
      });
      playlists.map((playlist) => {
        if (user.id == playlist.creator.id) {
          result.push(playlist);
        }
      });

      setIsLoading(false);
      return result;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const createPlaylist = async (name: string) => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        userId: user.id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const playlist = { ...data, musicIds: [], musics: [] } as IPlaylist;

      setIsLoading(false);
      return playlist;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const deletePlaylist = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/playlist?id=${id}&userId=${user.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  const addMusicToPlaylist = async (
    playlistIds: Array<number | null>,
    musicId: number | null
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/playlist/item`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          playlistIds: playlistIds.join(","),
          musicId,
          userId: user.id,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (typeof data == "object" && data.length > 0) {
        const playlist = data[0] as IPlaylist;

        const musicFilePromises = playlist.musics.map((music) => {
          return getAWSSignedURL(music.musicFile);
        });
        const musicFileCompressedPromises = playlist.musics.map((music) => {
          return getAWSSignedURL(music.musicFileCompressed);
        });
        const assets = await Promise.all([
          Promise.all(musicFilePromises),
          Promise.all(musicFileCompressedPromises),
        ]);
        playlist.musics.map((music, index) => {
          music.musicFile = assets[0][index];
          music.musicFileCompressed = assets[1][index];
        });

        setIsLoading(false);
        return playlist;
      } else {
        setIsLoading(false);
        return null;
      }
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const deleteMusicFromPlaylist = async (
    id: number | null,
    musicId: number | null
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/playlist/item?id=${id}&musicId=${musicId}&userId=${user.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    addMusicToPlaylist,
    deleteMusicFromPlaylist,
  };
};

export default usePlaylist;
