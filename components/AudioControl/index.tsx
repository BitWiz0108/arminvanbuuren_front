import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

import ButtonCircle from "@/components/ButtonCircle";
import List from "@/components/Icons/List";
import PlayPrev from "@/components/Icons/PlayPrev";
import Pause from "@/components/Icons/Pause";
import Play from "@/components/Icons/Play";
import PlayNext from "@/components/Icons/PlayNext";
import Setting from "@/components/Icons/Setting";
import Donate from "@/components/Icons/Donate";
import Shuffle from "@/components/Icons/Shuffle";
import RepeatAll from "@/components/Icons/RepeatAll";
import RepeatOne from "@/components/Icons/RepeatOne";
import ButtonVolume from "@/components/ButtonVolume";
import Playlist from "@/components/Icons/Playlist";
import MusicSettingsModal from "@/components/MusicSettingsModal";
import PlaylistModal from "@/components/PlaylistModal";
import AudioSlider from "@/components/AudioSlider";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";
import { useAuthValues } from "@/contexts/contextAuth";

import useOutsideClick from "@/hooks/useOutsideClick";
import usePlaylist from "@/hooks/usePlaylist";

import {
  IMAGE_BLUR_DATA_URL,
  MUSIC_QUALITY,
  PLACEHOLDER_IMAGE,
  REPEAT,
} from "@/libs/constants";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { DEFAULT_MUSIC } from "@/interfaces/IMusic";
import { IPlaylist } from "@/interfaces/IPlaylist";

type Props = {
  audioPlayer: IAudioPlayer;
  onListView: Function;
};

const AudioControl = ({ audioPlayer, onListView }: Props) => {
  const musicsettingsmodalRefMd = useRef(null);
  const playlistmodalRefMd = useRef(null);

  const { isSignedIn } = useAuthValues();
  const { isMobile, contentWidth, sidebarWidth } = useSizeValues();
  const { setIsDonationModalVisible } = useShareValues();

  const {
    isLoading,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    addMusicToPlaylist,
    deleteMusicFromPlaylist,
  } = usePlaylist();

  const [playlists, setPlaylists] = useState<Array<IPlaylist>>([]);

  const [isPlaylistModalMdVisible, setIsPlaylistModalMdVisible] =
    useState<boolean>(false);

  useOutsideClick(playlistmodalRefMd, () => {
    setIsPlaylistModalMdVisible(false);
  });

  const [isMusicSettingsModalMdVisible, setIsMusicSettingsModalMdVisible] =
    useState<boolean>(false);

  useOutsideClick(musicsettingsmodalRefMd, () => {
    setIsMusicSettingsModalMdVisible(false);
  });

  const track = audioPlayer.getPlayingTrack();

  useEffect(() => {
    if (isMobile) {
      audioPlayer.setPlayingQuality(MUSIC_QUALITY.LOW);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, audioPlayer]);

  useEffect(() => {
    if (isSignedIn) {
      fetchPlaylists().then((values) => {
        setPlaylists(values);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <div
      className={`fixed bottom-0 flex flex-row justify-start items-start w-full h-24 lg:h-32 bg-background border-l border-[#464646] ml-[1px] z-50`}
      style={{ left: `${sidebarWidth}px`, width: `${contentWidth}px` }}
    >
      <div className="hidden xs:flex w-24 h-24 lg:w-32 lg:h-32 min-w-[96px]">
        <Image
          className="w-full h-full object-cover"
          src={track.coverImage ?? PLACEHOLDER_IMAGE}
          width={1500}
          height={1500}
          alt=""
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          priority
        />
      </div>
      <div className="reltive flex flex-grow h-full flex-col justify-start items-center z-0">
        <div className="relative w-full h-1 bg-[#363636]">
          {audioPlayer.getPlayingTrack().id != DEFAULT_MUSIC.id && (
            <div className="absolute left-0 top-0 w-full h-full">
              <AudioSlider
                min={0}
                max={audioPlayer.duration}
                value={audioPlayer.trackProgress}
                step={1}
                onChange={(value: number) => audioPlayer.onScrub(value)}
              />
            </div>
          )}
        </div>

        <div className="relative w-full h-full flex flex-row px-2 lg:px-2 xl:px-5 justify-center lg:justify-between items-center space-x-1 lg:space-x-2 z-10">
          <div className="relative flex flex-row justify-start items-center space-x-1 lg:space-x-2 xl:space-x-5 w-auto lg:w-1/3">
            <ButtonCircle
              dark
              size="small"
              icon={<List width={24} height={24} />}
              onClick={() => onListView()}
            />
            <ButtonCircle
              dark
              size="small"
              icon={<Playlist width={24} height={24} />}
              onClick={() => setIsPlaylistModalMdVisible(true)}
            />

            <AnimatePresence>
              {isPlaylistModalMdVisible && (
                <motion.div
                  key={"playlistModalMd"}
                  ref={playlistmodalRefMd}
                  className="absolute bottom-16 left-0 w-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlaylistModal
                    isLoading={isLoading}
                    close={() => setIsPlaylistModalMdVisible(false)}
                    audioPlayer={audioPlayer}
                    playlists={playlists}
                    createNewPlaylist={(playlistName: string) => {
                      createPlaylist(playlistName)
                        .then((playlist) => {
                          if (playlist) {
                            const tplaylists = playlists.slice();
                            tplaylists.push(playlist);
                            setPlaylists(tplaylists);

                            toast.success("Successfully created playlist!");
                          } else {
                            toast.error(
                              "Something went wrong! Please try again."
                            );
                          }
                        })
                        .catch(() => {
                          toast.error(
                            "Something went wrong! Please try again."
                          );
                        });
                    }}
                    deletePlaylist={(playlistId: number | null) => {
                      deletePlaylist(playlistId)
                        .then((value) => {
                          if (value) {
                            const tplaylists = playlists.slice();
                            const index = tplaylists.findIndex(
                              (playlist) => playlist.id == playlistId
                            );
                            if (index >= 0) {
                              tplaylists.splice(index, 1);
                              setPlaylists(tplaylists);
                            }
                            toast.success("Successfully deleted playlist!");
                          } else {
                            toast.error(
                              "Something went wrong! Please try again."
                            );
                          }
                        })
                        .catch(() => {
                          toast.error(
                            "Something went wrong! Please try again."
                          );
                        });
                    }}
                    addMusicToPlaylist={(playlistId: number | null) => {
                      const tplaylists = playlists.slice();
                      const index = tplaylists.findIndex(
                        (playlist) => playlist.id == playlistId
                      );
                      if (index >= 0) {
                        const indexMusic = tplaylists[index].musics.findIndex(
                          (music) =>
                            music.id == audioPlayer.getPlayingTrack().id
                        );
                        if (indexMusic >= 0) {
                          toast.warn(
                            "Already added! Please select other playlist."
                          );
                          return;
                        }
                      } else {
                        toast.error("Something went wrong! Please try again.");
                        return;
                      }

                      addMusicToPlaylist(
                        [playlistId],
                        audioPlayer.getPlayingTrack().id
                      )
                        .then((playlist) => {
                          if (playlist) {
                            if (index >= 0) {
                              tplaylists[index] = playlist;
                              setPlaylists(tplaylists);
                            }
                            toast.success("Successfully added music!");
                          } else {
                            toast.error(
                              "Something went wrong! Please try again."
                            );
                          }
                        })
                        .catch(() => {
                          toast.error(
                            "Something went wrong! Please try again."
                          );
                        });
                    }}
                    deleteMusicFromPlaylist={(
                      playlistId: number | null,
                      musicId: number | null
                    ) => {
                      deleteMusicFromPlaylist(playlistId, musicId)
                        .then((value) => {
                          if (value) {
                            const tplaylists = playlists.slice();
                            const index = tplaylists.findIndex(
                              (playlist) => playlist.id == playlistId
                            );
                            if (index >= 0) {
                              tplaylists[index].musics = tplaylists[
                                index
                              ].musics.filter((music) => music.id != musicId);
                              setPlaylists(tplaylists);
                            }
                            toast.success("Successfully deleted music!");
                          } else {
                            toast.error(
                              "Something went wrong! Please try again."
                            );
                          }
                        })
                        .catch(() => {
                          toast.error(
                            "Something went wrong! Please try again."
                          );
                        });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden lg:flex flex-col w-2/3 justify-center items-start space-y-1 truncate">
              <h2 className="w-full text-primary text-left text-lg md:text-xl font-semibold truncate">
                {track.title}
              </h2>
              <p className="w-full text-secondary text-left text-small md:text-base truncate">
                {track.singer?.artistName}
              </p>
            </div>
          </div>

          <div className="flex flex-grow flex-row justify-center items-center space-x-1 lg:space-x-2 xl:space-x-5">
            <ButtonCircle
              dark
              size="small"
              icon={<PlayPrev />}
              onClick={() => audioPlayer.playPreviousMusic()}
            />
            <ButtonCircle
              dark={false}
              size="big"
              icon={
                audioPlayer.isPlaying ? (
                  <Pause width={40} height={40} />
                ) : (
                  <Play width={34} height={34} />
                )
              }
              onClick={() => {
                if (audioPlayer.isPlaying) {
                  audioPlayer.pause();
                } else {
                  audioPlayer.play();
                }
              }}
            />
            <ButtonCircle
              dark
              size="small"
              icon={<PlayNext />}
              onClick={() => audioPlayer.playNextMusic()}
            />
          </div>

          <div className="relative flex flex-row justify-end items-center space-x-1 lg:space-x-2 xl:space-x-5 w-auto lg:w-1/3">
            <ButtonCircle
              dark={!audioPlayer.isShuffled}
              size="small"
              icon={<Shuffle width={24} height={24} />}
              onClick={() => audioPlayer.setIsShuffled(!audioPlayer.isShuffled)}
            />
            <ButtonCircle
              dark={false}
              size="small"
              icon={
                audioPlayer.repeatType == REPEAT.ALL ? (
                  <RepeatAll width={24} height={24} />
                ) : (
                  <RepeatOne width={24} height={24} />
                )
              }
              onClick={() =>
                audioPlayer.setRepeatType(
                  audioPlayer.repeatType == REPEAT.ALL ? REPEAT.ONE : REPEAT.ALL
                )
              }
            />
            {!isMobile && (
              <>
                <ButtonCircle
                  dark
                  size="small"
                  icon={<Setting width={24} height={24} />}
                  onClick={() => setIsMusicSettingsModalMdVisible(true)}
                />
                <ButtonCircle
                  dark={false}
                  size="small"
                  icon={<Donate width={20} height={20} />}
                  onClick={() => setIsDonationModalVisible(true)}
                />
              </>
            )}
            <ButtonVolume
              size="small"
              iconSize={20}
              volume={audioPlayer.volume}
              setVolume={audioPlayer.setVolume}
            />
            <AnimatePresence>
              {isMusicSettingsModalMdVisible && (
                <motion.div
                  key={"musicSettingsModalMd"}
                  ref={musicsettingsmodalRefMd}
                  className="absolute bottom-16 right-0 w-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MusicSettingsModal
                    close={() => setIsMusicSettingsModalMdVisible(false)}
                    audioPlayer={audioPlayer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControl;
