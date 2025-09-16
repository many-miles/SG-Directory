import { cn, formatDate } from "../lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Author, Service } from "../sanity/types";
import { Skeleton } from "../components/ui/skeleton";

export type ServiceTypeCard = Omit<Service, "author"> & { author?: Author };

const ServiceCard = ({ post }: { post: ServiceTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <article className="service-card">
      <div className="flex flex-col gap-4">
        <div className="flex-between">
          <p className="service-card_date">{formatDate(_createdAt)}</p>
          <div className="flex items-center gap-2 text-black-100">
            <EyeIcon className="w-4 h-4" />
            <p>{views || 0}</p>
          </div>
        </div>

        <Link href={`/service/${_id}`} className="flex flex-col gap-4">
          {image && (
            <Image
              src={image}
              alt="service image"
              width={384}
              height={164}
              className="service-card_img"
            />
          )}
          <div>
            <h3 className="text-24-black line-clamp-1">{title}</h3>
            {description && (
              <p className="service-card_desc">{description}</p>
            )}
          </div>
        </Link>

        <div className="flex-between">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <Image
                src={author.image}
                alt="user image"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="default avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <p className="text-16-medium">{author?.name}</p>
          </div>

          {category && (
            <Link
              href={`/service/${_id}`}
              className="service-card_btn"
            >
              View Service
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export const ServiceCardSkeleton = () => {
  return (
    <div className="service-card_skeleton">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default ServiceCard;