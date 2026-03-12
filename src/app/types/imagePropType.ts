import { PROFILE_QUERYResult } from "@/sanity/types"


export type imageProp = {
    image :  NonNullable<PROFILE_QUERYResult>["image"],
    width? : number | null,
    height? : number | null,
    alt?: string,
    className?: string
}