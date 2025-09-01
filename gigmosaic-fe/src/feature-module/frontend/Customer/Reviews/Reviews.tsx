import { useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Pagination } from '@heroui/react';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';

const Reviews = () => {
  const allReviews = [
    {
      title: 'Building Construction Services',
      name: 'Jeffrey Adang',
      date: '2023-08-25',
      rating: 5,
      review:
        'The construction service delivered excellent craftsmanship, completing my home renovation on time with clear communication throughout.',
      images: [
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100',
      ],
      profileImage: 'https://via.placeholder.com/40',
    },
    {
      title: 'Commercial Painting Services',
      name: 'Nancy Olson',
      date: '2023-07-19',
      rating: 5,
      review:
        'The commercial painting service provided outstanding results, with precise attention to detail and timely completion.',
      images: ['https://via.placeholder.com/100'],
      profileImage: 'https://via.placeholder.com/40',
    },
    {
      title: 'Plumbing Services',
      name: 'Ramon Kingsley',
      date: '2023-07-15',
      rating: 5,
      review:
        'The plumbing job was efficient and reliable, quickly resolving the issue with excellent workmanship.',
      images: [
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100',
      ],
      profileImage: 'https://via.placeholder.com/40',
    },
  ];

  const [reviews] = useState(allReviews);

  return (
    <div className=" mx-auto p-6 bg-gray-50 min-h-screen">
      <BreadCrumb title="Reviews" item1="Customer" />
      <h2 className="text-2xl font-semibold text-gray-800 ">Reviews</h2>

      <div className="space-y-6 mt-7">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <img
                src={review.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {review.title}
                </h3>
                <div className="flex items-center space-x-1 text-gray-600 text-sm">
                  <span className="font-semibold">{review.name}</span>
                  <span>• {new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mt-1">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 3a1 1 0 011.902 0l1.588 4.756h5.01a1 1 0 01.618 1.786l-4.05 2.942 1.588 4.756a1 1 0 01-1.54 1.118L10 15.417l-4.165 2.941a1 1 0 01-1.54-1.118l1.588-4.756-4.05-2.942a1 1 0 01.618-1.786h5.01L9.049 3z" />
                      </svg>
                    ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mt-3">{review.review}</p>
            {review.images.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Review"
                    className="w-24 h-24 rounded-lg border border-gray-300"
                  />
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4 space-x-3">
              <FiEdit
                className="text-gray-500 hover:text-blue-500 cursor-pointer"
                size={18}
              />
              <FiTrash
                className="text-red-500 hover:text-red-700 cursor-pointer"
                size={18}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination initialPage={1} total={10} isDisabled />
      </div>
    </div>
  );
};

export default Reviews;
