import { NextResponse } from "next/server";

export const sendApiRes = ({message, statusCode,success,data,}) => {
  return NextResponse.json({
    ...(message&&{ message:message}),
    ...(data && { data: data }),
    success: success||false,
   
  },{
    status: statusCode
  });
};
