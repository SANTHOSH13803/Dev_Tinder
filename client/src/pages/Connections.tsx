import ConnectionCard from "@/components/ConnectionCard";
import {
  useLazyGetFriendsQuery,
  useLazyGetPendingConnectionsQuery
} from "@/store/api/user/userApi.slice";
import type { PendingRequestUser } from "@/types/user.type";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/ui/empty";
import { Page } from "@/components/Page";
type ConnectionProps = {
  view: boolean;
};
const Connections = ({ view }: ConnectionProps) => {
  const [connections, setConnections] = useState<PendingRequestUser[] | []>([]);
  const [
    pendingConnectionApi,
    {
      isLoading: pendingConnectionLoading,
      isFetching: pendingConnectionFetching
    }
  ] = useLazyGetPendingConnectionsQuery();
  const [
    getFriendsApi,
    { isLoading: getFriendsLoading, isFetching: getFriendsFetching }
  ] = useLazyGetFriendsQuery();

  const isLoading = pendingConnectionLoading || getFriendsLoading;
  const isFetching = pendingConnectionFetching || getFriendsFetching;
  const skeletonArray = Array.from({ length: 3 }, (_, i) => ({ name: i }));
  const fetchPendingConnectionRequest = async () => {
    try {
      const fetcher = view ? getFriendsApi : pendingConnectionApi;
      const response = await fetcher().unwrap();
      if (response.success) {
        setConnections(response.data);
      } else {
        setConnections([]);
      }
    } catch (error) {
      setConnections([]);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchPendingConnectionRequest();
  }, [view]);

  return (
    <Page className="">
      <div className="flex flex-col justify-center items-center">
        {isLoading && isFetching ? (
          skeletonArray.map((e) => (
            <Skeleton
              key={e.name}
              className="min-w-50 lg:min-w-96 h-20 rounded-lg p-2 m-2"
            />
          ))
        ) : (
          <>
            {connections?.length === 0 ? (
              <Empty className="lg:w-4/12 bg-accent ">
                <EmptyHeader>
                  <EmptyTitle>No Connection Requests</EmptyTitle>
                  <EmptyDescription>
                    There are no connection Request
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                {connections.map((each) => (
                  <ConnectionCard
                    view={view}
                    row={each}
                    key={each.requestId}
                    refetchConnections={fetchPendingConnectionRequest}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </Page>
  );
};

export default Connections;
