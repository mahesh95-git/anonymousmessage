import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, options);
  if (!session) {
    return {
      props: {},
    };
  }
  return {
    props: {
      session,
    },
  };
};
