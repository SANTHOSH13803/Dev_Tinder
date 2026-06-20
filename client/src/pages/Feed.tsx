import React, { useEffect, useState } from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform
} from "framer-motion";
import {
  useGetFeedQuery,
  useSendRequestMutation
} from "../store/api/user/userApi.slice";
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
type CardProps = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  skills: string[];
  cards: CardsType[];
  photoURL: string;
  setCards: React.Dispatch<React.SetStateAction<CardsType[]>>;
  fromProfile?: boolean;
};
const Feed = () => {
  const [page, setPage] = useState(1);
  const { data: cardData } = useGetFeedQuery({
    params: { page: page, limit: 10 }
  });

  const [cards, setCards] = useState<CardsType[] | []>([]);
  useEffect(() => {
    const _cards = cardData?.data;
    if (_cards?.length) {
      setCards(_cards);
    }
  }, [cardData]);

  useEffect(() => {}, [cards]);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="grid">
        {cards.map((card) => (
          <Card key={card._id} cards={cards} setCards={setCards} {...card} />
        ))}
      </div>
    </div>
  );
};

export const Card = ({
  _id,
  photoURL,
  setCards,
  cards,
  firstName,
  age,
  skills,
  fromProfile = false
}: CardProps) => {
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  const [sendRequestApi] = useSendRequestMutation();

  const rotateRaw = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = _id === cards[cards.length - 1]._id;

  const rotate = useTransform(() => {
    return `${rotateRaw.get()}deg`;
  });
  const sendRequest = async (type: "interested" | "ignored") => {
    try {
      await sendRequestApi({ status: type, requestId: _id });
    } catch (error) {
      toast.error("Something Went wrong");
    }
  };

  const removeCard = () => {
    setCards((pv) => pv.filter((v) => v._id !== _id));
  };

  const acceptRequest = () => {
    sendRequest("interested");
    removeCard();
  };
  const rejectRequest = () => {
    sendRequest("ignored");
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

  const handlePointerDown = (event: any) => {
    if (isFront) {
      dragControls.start(event, { distanceThreshold: 0 });
    }
  };

  return (
    <motion.div
      draggable={false}
      onPointerDown={handlePointerDown}
      className={`${fromProfile ? "w-[50vw] h-[80vh]" : " h-[80vh] w-[80vw] md:w-[40vw] lg:w-[30vw]"} relative overflow-visible rounded-3xl bg-cover bg-center`}
      style={{
        backgroundImage: `url(${photoURL})`,
        gridRow: 1,
        gridColumn: 1,
        zIndex: isFront ? cards.length : 1,
        pointerEvents: isFront ? "auto" : "none",
        x,
        opacity,
        rotate,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined
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
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
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
        {/* Action Buttons */}
        <div className="flex items-center gap-8 justify-center mt-4">
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
            onClick={acceptRequest}
          >
            <IoClose className="text-4xl text-pink-500" />
          </button>

          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
            onClick={rejectRequest}
          >
            <IoHeart className="text-4xl text-green-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Feed;
