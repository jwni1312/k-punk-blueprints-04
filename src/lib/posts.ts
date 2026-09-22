import type { ComponentType } from "react";

export type Post = {
  slug: string;
  title: string;
  date: string;
  iso: string;
  dispatch: string;
  body: ComponentType;
};

import { RingRoad } from "@/posts/ring-road";
import { WrongAddress } from "@/posts/wrong-address";
import { Overheard27 } from "@/posts/overheard-27";
import { ArchiveWound } from "@/posts/archive-wound";

export const posts: Post[] = [
  {
    slug: "ring-road",
    title: "The unbearable lightness of the ring road",
    date: "17.vii.2026",
    iso: "2026-07-17",
    dispatch: "dispatch 004",
    body: RingRoad,
  },
  {
    slug: "wrong-address",
    title: "A love letter to the wrong address",
    date: "03.vii.2026",
    iso: "2026-07-03",
    dispatch: "dispatch 003",
    body: WrongAddress,
  },
  {
    slug: "overheard-27",
    title: "Overheard on the 27",
    date: "21.vi.2026",
    iso: "2026-06-21",
    dispatch: "dispatch 002",
    body: Overheard27,
  },
  {
    slug: "archive-wound",
    title: "The archive is a wound",
    date: "09.vi.2026",
    iso: "2026-06-09",
    dispatch: "dispatch 001",
    body: ArchiveWound,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
