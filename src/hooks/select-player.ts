import {useRouter, useSearchParams} from "next/navigation";

export default function useSelectPlayer(login: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('player') === login) {
      params.delete('player');
    } else {
      params.set('player', login);
    }
    router.push(`?${params.toString()}`);
  };
}