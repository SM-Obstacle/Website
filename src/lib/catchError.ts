import { ErrorLike } from "@apollo/client";

function hasMessage(obj: object): obj is { message: string } {
  return "message" in obj && typeof obj.message === "string";
}

function hasName(obj: object): obj is { name: string } {
  return "name" in obj && typeof obj.name === "string";
}

function hasStack(obj: object): obj is { stack?: string } {
  const isStackInObj = "stack" in obj;
  return (
    (isStackInObj &&
      (typeof obj.stack === "string" || typeof obj.stack === "undefined")) ||
    !isStackInObj
  );
}

type GqlError = {
  error: ErrorLike;
  data: undefined;
};

export default function catchGqlError(err: unknown): GqlError | never {
  if (
    typeof err === "object" &&
    err !== null &&
    hasMessage(err) &&
    hasName(err) &&
    hasStack(err)
  ) {
    return { error: err, data: undefined };
  }
  throw err;
}
