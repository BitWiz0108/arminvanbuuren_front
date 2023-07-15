import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import { API_BASE_URL, API_VERSION, PAGE_LIMIT } from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";
import { IAlbum } from "@/interfaces/IAlbum";

const useMusic = () => {
  const { accessToken, user, isMembership } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMusics = async (
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/music/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        page,
        limit,
        isExclusive: isMembership ? null : false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const musics = data.musics as Array<IMusic>;
      const musicFilePromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFile);
      });
      const musicFileCompressedPromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFileCompressed);
      });
      const assets = await Promise.all([
        Promise.all(musicFilePromises),
        Promise.all(musicFileCompressedPromises),
      ]);
      musics.map((music, index) => {
        music.musicFile = assets[0][index];
        music.musicFileCompressed = assets[1][index];
      });

      const pages = Number(data.pages);

      setIsLoading(false);
      return { musics, pages };
    } else {
      setIsLoading(false);
    }
    return { musics: [], pages: 0 };
  };

  const fetchAllAlbums = async (
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/music/album/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          page,
          limit,
          isExclusive: isMembership ? null : false,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const albums = data as Array<IAlbum>;
      const promises = albums.map((album) => {
        const musics = album.musics;
        const musicFilePromises = musics.map((music) => {
          return getAWSSignedURL(music.musicFile);
        });
        const musicFileCompressedPromises = musics.map((music) => {
          return getAWSSignedURL(music.musicFileCompressed);
        });
        return Promise.all([
          Promise.all(musicFilePromises),
          Promise.all(musicFileCompressedPromises),
        ]);
      });
      const assets = await Promise.all(promises);
      albums.map((album, indexAlbum) => {
        album.musics.map((music, indexMusic) => {
          music.musicFile = assets[indexAlbum][0][indexMusic];
          music.musicFileCompressed = assets[indexAlbum][1][indexMusic];
        });
      });

      setIsLoading(false);
      return albums;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchAlbumMusics = async (
    albumId: number | null,
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/music/album/music/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          albumId,
          userId: user.id,
          page,
          limit,
          isExclusive: isMembership ? null : false,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const musics = data as Array<IMusic>;
      const musicFilePromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFile);
      });
      const musicFileCompressedPromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFileCompressed);
      });
      const assets = await Promise.all([
        Promise.all(musicFilePromises),
        Promise.all(musicFileCompressedPromises),
      ]);
      musics.map((music, index) => {
        music.musicFile = assets[0][index];
        music.musicFileCompressed = assets[1][index];
      });

      setIsLoading(false);
      return musics;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const toggleMusicFavorite = async (
    musicId: number | null,
    isFavorite: boolean
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/music/favorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id, musicId, isFavorite }),
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
    fetchMusics,
    fetchAllAlbums,
    fetchAlbumMusics,
    toggleMusicFavorite,
  };
};

export default useMusic;
