import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

import Add from "@/components/Icons/Add";
import AddFile from "@/components/Icons/AddFile";
import X from "@/components/Icons/X";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowRight from "@/components/Icons/ArrowRight";
import Play from "@/components/Icons/Play";
import Delete from "@/components/Icons/Delete";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { IPlaylist } from "@/interfaces/IPlaylist";

type Props = {
  isLoading: boolean;
  close: Function;
  audioPlayer: IAudioPlayer;
  playlists: Array<IPlaylist>;
  createNewPlaylist: Function;
  deletePlaylist: Function;
  addMusicToPlaylist: Function;
  deleteMusicFromPlaylist: Function;
};

const PlaylistModal = ({
  isLoading,
  close,
  audioPlayer,
  playlists,
  createNewPlaylist,
  deletePlaylist,
  addMusicToPlaylist,
  deleteMusicFromPlaylist,
}: Props) => {
  const { user } = useAuthValues();

  const [playlistName, setPlaylistName] = useState<string>("");
  const [listOpeneds, setListOpeneds] = useState<Array<boolean>>([]);

  useEffect(() => {
    setListOpeneds(Array(playlists.length).fill(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists.length]);

  return (
    <div className="relative w-full h-80 flex flex-col justify-start items-center space-y-2 p-2 bg-third rounded-md overflow-x-hidden overflow-y-auto">
      <div className="w-full flex justify-start items-center space-x-2 z-0">
        <input
          type="text"
          id="playlistname"
          className="flex w-auto py-1 flex-grow text-primary text-sm bg-transparent outline-none focus:outline-none border-b border-bluePrimary focus:border-blueSecondary"
          value={playlistName}
          placeholder="New playlist name"
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button
          className={twMerge(
            "inline-flex font-semibold justify-center items-center text-bluePrimary hover:text-blueSecondary transition-all duration-300 cursor-pointer"
          )}
          onClick={() => {
            if (!playlistName) {
              toast.warn("Please enter name correctly.");
              return;
            }
            createNewPlaylist(playlistName);
          }}
        >
          <Add width={26} height={26} />
        </button>
      </div>

      {playlists.map((playlist, playlistIndex) => {
        return (
          <div
            key={playlistIndex}
            className="w-full flex flex-col justify-start items-end cursor-pointer space-y-1 z-0"
          >
            <div className="w-full flex justify-start items-center space-x-2 p-2 bg-background hover:bg-activeSecondary rounded-md">
              {listOpeneds[playlistIndex] ? (
                <ArrowDown
                  width={12}
                  height={12}
                  className={twMerge(
                    "min-w-[12px]",
                    JSON.stringify(playlist.musics) ==
                      JSON.stringify(audioPlayer.musics)
                      ? "text-blueSecondary"
                      : "text-primary"
                  )}
                />
              ) : (
                <ArrowRight
                  width={14}
                  height={14}
                  className={twMerge(
                    "min-w-[14px]",
                    JSON.stringify(playlist.musics) ==
                      JSON.stringify(audioPlayer.musics)
                      ? "text-blueSecondary"
                      : "text-primary"
                  )}
                />
              )}
              <span
                className="inline-flex w-auto flex-grow truncate text-sm select-none"
                onClick={() => {
                  const tlistOpeneds = listOpeneds.slice();
                  tlistOpeneds[playlistIndex] = !tlistOpeneds[playlistIndex];
                  setListOpeneds(tlistOpeneds);
                }}
              >
                {playlist.name}
              </span>
              {playlist.creator.id == user.id && (
                <>
                  <AddFile
                    className="text-primary hover:text-blueSecondary"
                    onClick={() => addMusicToPlaylist(playlist.id)}
                  />
                  <Delete
                    className="text-primary hover:text-blueSecondary"
                    onClick={() => deletePlaylist(playlist.id)}
                  />
                </>
              )}
            </div>
            {listOpeneds[playlistIndex] && (
              <div className="w-11/12 flex flex-col justify-start items-start space-y-1">
                {playlist.musics.map((music, indexMusic) => {
                  return (
                    <div
                      key={indexMusic}
                      className="w-full flex justify-start items-center space-x-2 p-2 bg-background rounded-sm"
                    >
                      <Play
                        width={14}
                        height={14}
                        className={twMerge(
                          "min-w-[14px]",
                          audioPlayer.getPlayingTrack().id == music.id
                            ? "text-blueSecondary"
                            : "text-transparent"
                        )}
                      />
                      <span
                        className="inline-flex w-auto flex-grow truncate text-xs select-none"
                        onClick={() => {
                          audioPlayer.setMusics(playlist.musics);
                          audioPlayer.setPlayingIndex(indexMusic);
                        }}
                      >
                        {music.title}
                      </span>
                      {user.id == playlist.creator.id && (
                        <X
                          width={14}
                          height={14}
                          className="min-w-[14px] text-primary hover:text-blueSecondary"
                          onClick={() =>
                            deleteMusicFromPlaylist(playlist.id, music.id)
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-transparent z-10">
          <Loading width={32} height={32} />
        </div>
      )}
    </div>
  );
};

export default PlaylistModal;
