import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import ReplyPrayerRequestModal from "@/components/ReplyPrayerRequestModal";
import ShareModal from "@/components/ShareModal";
import DonationModal from "@/components/DonationModal";
import AudioControl from "@/components/AudioControl";
import TextInput from "@/components/TextInput";
import PrayerRequest from "@/components/PrayerRequest";
import ButtonSettings from "@/components/ButtonSettings";
import Switch from "@/components/Switch";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import usePrayerRequest from "@/hooks/usePrayerRequest";

import { APP_TYPE, ASSET_TYPE, SYSTEM_TYPE } from "@/libs/constants";

import {
  DEFAULT_PRAYERREQUEST,
  IPrayerRequest,
} from "@/interfaces/IPrayerRequest";

const POSTS_PAGE_SIZE = 5;

export default function FanClub() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();

  const {
    isLoading,
    fetchPrayerRequests,
    togglePray,
    createPrayerRequest,
    deletePrayerRequest,
    updatePrayerRequest,
  } = usePrayerRequest();
  const { isMobile } = useSizeValues();
  const { audioPlayer } = useShareValues();

  const [prayerRequests, setPrayerRequests] = useState<Array<IPrayerRequest>>(
    []
  );
  const [postsPage, setPostsPage] = useState<number>(1);
  const [postsPageCount, setPostsPageCount] = useState<number>(1);
  const [isPostModalOpened, setIsPostModalOpened] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPrayerRequest>(
    DEFAULT_PRAYERREQUEST
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isDetailViewOpened, setIsDetailedViewOpened] =
    useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number>(0);

  const fetchMorePosts = () => {
    fetchPrayerRequests(postsPage + 1, POSTS_PAGE_SIZE).then((result) => {
      setPrayerRequests([...prayerRequests, ...result.prayerRequests]);
      setPostsPageCount(result.pages);

      if (postsPage < result.pages) {
        setPostsPage((prev) => prev + 1);
      }
    });
  };

  const clearFields = () => {
    setTitle("");
    setContent("");
  };

  const onConfirm = async () => {
    if (isEditing) {
      updatePrayerRequest(editingId, isAnonymous, title, content).then(
        (result) => {
          if (result) {
            clearFields();
            toast.success("Successfully updated!");
            fetchPrayerRequests(1, POSTS_PAGE_SIZE).then((value) => {
              setPrayerRequests(value.prayerRequests);
              setPostsPageCount(value.pages);
              setPostsPage(1);
            });
          }
          setIsDetailedViewOpened(false);
        }
      );
    } else {
      if (!title || !content) {
        toast.warning("Please input all the fields!");
      } else {
        createPrayerRequest(isAnonymous, title, content).then((result) => {
          if (result) {
            clearFields();
            toast.success("Successfully posted!");
            fetchPrayerRequests(1, POSTS_PAGE_SIZE).then((value) => {
              setPrayerRequests(value.prayerRequests);
              setPostsPageCount(value.pages);
              setPostsPage(1);
            });
          }
          setIsDetailedViewOpened(false);
        });
      }
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPrayerRequests(1, POSTS_PAGE_SIZE).then((value) => {
        setPrayerRequests(value.prayerRequests);
        setPostsPageCount(value.pages);
        setPostsPage(1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const postsView = (
    <div className="w-full flex flex-col justify-start items-center space-y-5">
      <div className="w-full flex justify-end items-center p-5">
        <div className="w-40">
          <ButtonSettings
            label="Add"
            bgColor="cyan"
            onClick={() => {
              setIsEditing(false);
              setIsDetailedViewOpened(true);
            }}
          />
        </div>
      </div>
      {prayerRequests?.map((prayerRequest, index) => {
        return (
          <PrayerRequest
            key={index}
            prayerRequest={prayerRequest}
            DeletePrayerRequest={(id: number) => {
              deletePrayerRequest(id).then((value) => {
                if (value) {
                  fetchPrayerRequests(1, POSTS_PAGE_SIZE).then((value) => {
                    setPrayerRequests(value.prayerRequests);
                    setPostsPageCount(value.pages);
                    setPostsPage(1);
                  });
                }
              });
            }}
            EditPrayerRequest={(id: number) => {
              setIsEditing(true);
              setIsDetailedViewOpened(true);
              setTitle(prayerRequest.title);
              setContent(prayerRequest.content);
              setIsAnonymous(prayerRequest.isAnonymous);
              setEditingId(id);
            }}
            favorite={() => {
              togglePray(prayerRequest.id, !prayerRequest.isPraying).then(
                (value) => {
                  if (value) {
                    const tposts = prayerRequests.slice();
                    tposts[index].numberOfPrays = tposts[index].isPraying
                      ? tposts[index].numberOfPrays - 1
                      : tposts[index].numberOfPrays + 1;
                    tposts[index].isPraying = !tposts[index].isPraying;
                    setPrayerRequests(tposts);
                  }
                }
              );
            }}
            comment={() => {
              setSelectedPost(prayerRequest);
              setIsPostModalOpened(true);
            }}
          />
        );
      })}
      {isLoading ? (
        <Loading width={30} height={30} />
      ) : (
        postsPageCount > postsPage && (
          <div className="w-full flex justify-center items-center">
            <button
              className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-third rounded-full border border-secondary cursor-pointer transition-all duration-300"
              onClick={() => fetchMorePosts()}
            >
              + More
            </button>
          </div>
        )
      )}
    </div>
  );

  const detailContentView = (
    <div className="relative w-full justify-center items-center p-5">
      <div className="p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-2xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} prayer request
        </label>
        <div className="flex flex-col">
          <div className="w-full px-0 flex flex-col lg:flex-col items-center">
            <TextInput
              sname="Prayer Request Title"
              label=""
              placeholder="Enter Prayer Request Title"
              type="text"
              value={title}
              setValue={setTitle}
            />

            <TextInput
              sname="Prayer Request Content"
              label=""
              placeholder="Enter Prayer Request Content"
              type="text"
              value={content}
              setValue={setContent}
            />
            <div className="relative w-full flex justify-center items-center mt-5">
              <Switch
                checked={isAnonymous}
                setChecked={setIsAnonymous}
                label="Post As Anonymous"
                labelPos="left"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-10">
            <ButtonSettings
              label="Cancel"
              onClick={() => setIsDetailedViewOpened(false)}
            />
            {isEditing ? (
              <ButtonSettings
                bgColor="cyan"
                label="Update"
                onClick={onConfirm}
              />
            ) : (
              <ButtonSettings bgColor="cyan" label="Post" onClick={onConfirm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div
          className={twMerge(
            "relative px-5 pt-16 bg-background w-full min-h-screen flex justify-center items-start",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
        >
          <div className="relative w-full xl:w-5/6 flex flex-col justify-start items-center">
            <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-10 space-y-10 lg:space-y-0">
              {isDetailViewOpened ? detailContentView : postsView}
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <ShareModal />

      <ReplyPrayerRequestModal
        prayerRequest={selectedPost}
        setPrayerRequest={setSelectedPost}
        visible={isPostModalOpened}
        setVisible={setIsPostModalOpened}
      />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() =>
          router.push(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music")
        }
      />
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
