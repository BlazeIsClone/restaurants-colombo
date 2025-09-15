import Image from "next/image";
import Link from "next/link";
import articles from "@/data/articles.json";
import { Article } from "@/types/article";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Guides for Colombo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best dining experiences in Colombo through our curated guides. From brunch spots to fine dining, find your perfect meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: Article) => (
            <div
              key={article.id}
            >
              <Link href={`/${article.id}`} className="block">
                <div className="relative h-[300px] w-full">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {article.featured_restaurants.length} spots
                    </div>
                  </div>
                </div>
              </Link>

              <div className="pt-4">
                <Link href={`/${article.id}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
