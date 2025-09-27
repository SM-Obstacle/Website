import { useRouter, useSearchParams } from "next/navigation";

/**
 *
 * @param login The player login to toggle selection.
 * @returns A function that toggles the selection of the player login in the URL.
 */
export default function useToggleSelectPlayer(login: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("player") === login) {
      params.delete("player");
    } else {
      params.set("player", login);
    }
    router.push(`?${params.toString()}`);
  };
}
