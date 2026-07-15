import React, { useEffect, useState } from "react";
import {
  useLazyGetFeedQuery,
  useSendRequestMutation
} from "../store/api/user/userApi.slice";
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform
} from "framer-motion";
import { IoClose, IoHeart } from "react-icons/io5";
import { toast } from "react-toastify";

type CardsType = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  skills: string[];
  photoURL: string;
};

const Feed = () => {
  const [cards, setCards] = useState<CardsType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [getFeedApi] = useLazyGetFeedQuery();

  const fetchFeed = async (pageNumber: number) => {
    try {
      setIsFetchingNextPage(true);

      const response = await getFeedApi({
        params: {
          page: pageNumber,
          limit: 10
        }
      }).unwrap();

      const newCards = response?.data ?? [];

      if (newCards.length < 10) {
        setHasMore(false);
      }
      // console.log(1);
      setCards((prev) => [...newCards, ...prev]);
    } catch (error) {
      toast.error("Failed to load feed");
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  useEffect(() => {
    if (page === 1) return;

    fetchFeed(page);
  }, [page]);

  const loadNextPage = () => {
    if (!hasMore || isFetchingNextPage) return;

    setPage((prev) => prev + 1);
  };

  const showEmpty = cards.length === 0 && !hasMore && !isFetchingNextPage;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="grid">
        {cards.map((card) => (
          <Card
            key={card._id}
            cards={cards}
            setCards={setCards}
            loadNextPage={loadNextPage}
            hasMore={hasMore}
            {...card}
          />
        ))}
      </div>

      {showEmpty && (
        <div className="text-center text-xl font-semibold">
          No More Connections Found
        </div>
      )}
    </div>
  );
};

type CardProps = CardsType & {
  cards: CardsType[];
  setCards: React.Dispatch<React.SetStateAction<CardsType[]>>;
  loadNextPage: () => void;
  hasMore: boolean;
};

const Card = ({
  _id,
  photoURL,
  firstName,
  age,
  skills,
  cards,
  setCards,
  loadNextPage,
  hasMore
}: CardProps) => {
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  const [sendRequestApi] = useSendRequestMutation();

  const rotateRaw = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = cards.length > 0 && _id === cards[cards.length - 1]._id;

  const rotate = useTransform(() => {
    return `${rotateRaw.get()}deg`;
  });

  const sendRequest = async (status: "interested" | "ignored") => {
    try {
      await sendRequestApi({
        status,
        requestId: _id
      }).unwrap();
    } catch (e) {
      console.warn(e);
    }
  };

  const removeCard = () => {
    setCards((prev) => {
      const updatedCards = prev.filter((card) => card._id !== _id);

      if (updatedCards.length === 2 && hasMore) {
        loadNextPage();
      }

      return updatedCards;
    });
  };

  const acceptRequest = async () => {
    await sendRequest("interested");
    removeCard();
  };

  const rejectRequest = async () => {
    await sendRequest("ignored");
    removeCard();
  };

  const handleDragEnd = () => {
    if (x.get() > 100) {
      acceptRequest();
    }

    if (x.get() < -100) {
      rejectRequest();
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (isFront) {
      dragControls.start(event, {
        distanceThreshold: 0
      });
    }
  };

  return (
    <motion.div
      draggable={false}
      onPointerDown={handlePointerDown}
      className="relative h-[80vh] w-[80vw] overflow-visible rounded-3xl bg-cover bg-center md:w-[40vw] lg:w-[30vw]"
      style={{
        backgroundImage: `url(${photoURL})`,
        gridRow: 1,
        gridColumn: 1,
        zIndex: isFront ? cards.length : 1,
        pointerEvents: isFront ? "auto" : "none",
        x,
        opacity,
        rotate
      }}
      animate={{
        scale: isFront ? 1 : 0.95,
        y: isFront ? 0 : -8
      }}
      drag={isFront ? "x" : false}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

      <div className="absolute right-0 bottom-0 left-0 z-10 p-6 text-white">
        <div className="flex items-end gap-3">
          <h2 className="text-4xl font-bold">{firstName}</h2>
          <span className="mb-1 text-sm font-light">{age}</span>
        </div>

        {skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center gap-8">
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
            onClick={rejectRequest}
          >
            <IoClose className="text-4xl text-pink-500" />
          </button>

          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
            onClick={acceptRequest}
          >
            <IoHeart className="text-4xl text-green-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Feed;
