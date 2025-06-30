'use client'

import { Video } from "@imagekit/next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

export default function VideoComponent({ video }: { video: IVideo }) {
  const router = useRouter();

const handleDelete = async () => {
  const confirmed = confirm("Are you sure you want to delete this video?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/videos/${video._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted");
      router.refresh(); // Or use router.push() if you want to redirect
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  } catch (error) {
    console.error("Error deleting:", error);
    alert("Failed to delete video");
  }
};


  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <Video
              urlEndpoint={urlEndPoint}
              src={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2 flex justify-between">
          {video.description}
          <Trash2 className="text-red-400 cursor-pointer" onClick={handleDelete} />
        </p>


      </div>
    </div>
  );
}