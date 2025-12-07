"use client";

import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";

export default function NonOverwritingForm({
  keysToRemove = [],
  ...props
}: Omit<React.ComponentProps<typeof Form>, "onSubmit"> & {
  keysToRemove?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    // Create a new URLSearchParams with existing values
    const params = new URLSearchParams(searchParams.toString());

    // Add/overwrite only the parameters from the current form
    for (const [key, value] of form.entries()) {
      params.set(key, value.toString());
    }

    for (const key of keysToRemove) {
      params.delete(key);
    }

    // Push the new URL without losing previous form values
    router.push(`?${params.toString()}`);
  };

  return <Form {...props} onSubmit={handleSubmit} />;
}
