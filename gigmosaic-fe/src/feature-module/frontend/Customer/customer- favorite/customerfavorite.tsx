import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import car from '../../../../assets/Img/Favorite/car-repair-services.jpg';
import car2 from '../../../../assets/Img/Favorite/toughened-glass-fitting-services.jpg';
import car3 from '../../../../assets/Img/Favorite/computer-& -server-amc-service.jpg';
import car4 from '../../../../assets/Img/Favorite/interior-designing.jpg';
import BreadCrumb from '../../../components/common/breadcrumb/breadCrumb';

const CustomerFavorite = () => {
  const favorites = [
    {
      title: 'Car Repair Services',
      category: 'Car Wash',
      name: 'John Smith',
      location: 'New Jersey, USA',
      image: car,
    },
    {
      title: 'Toughened Glass Fitting Services',
      category: 'Construction',
      name: 'Charles',
      location: 'Chicago, USA',
      image: car2,
    },
    {
      title: 'Computer & Server AMC Service',
      category: 'Construction',
      name: 'Wilfredo',
      location: 'Los Angeles, USA',
      image: car3,
    },
    {
      title: 'Interior Designing',
      category: 'Interior',
      name: 'John Doe',
      location: 'Detroit, USA',
      image: car4,
    },
    {
      title: 'Steam Car Wash',
      category: 'Car Wash',
      name: 'Hamilton',
      location: 'San Jose, USA',
      image:
        'https://images.pexels.com/photos/6114377/pexels-photo-6114377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Electric Panel Repairing Service',
      category: 'Electrical',
      name: 'Blackwell',
      location: 'San Francisco, USA',
      image:
        'https://images.pexels.com/photos/6061475/pexels-photo-6061475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'House Cleaning Services',
      category: 'Cleaning',
      name: 'Wilson',
      location: 'Denver, USA',
      image:
        'https://images.pexels.com/photos/5092867/pexels-photo-5092867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Commercial Painting Services',
      category: 'Painting',
      name: 'Clarence',
      location: 'Portland, USA',
      image:
        'https://images.pexels.com/photos/1070976/pexels-photo-1070976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Building Construction Services',
      category: 'Construction',
      name: 'Roberts',
      location: 'Houston, USA',
      image:
        'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <div className="p-6  min-h-screen">
      <BreadCrumb title='Favorites' item1='Customer'/>
      <h2 className="text-2xl sm mb-4 mt-4">Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favorites.map((item, index) => (
          <Card
            key={index}
            className="w-full bg-white border rounded-lg shadow-md"
          >
            <CardHeader className="p-0 relative">
              <div className="w-full h-[200px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  shadow="md"
                  radius="none"
                />
              </div>
              <span className="absolute top-3 left-3 bg-[#12bbb5] text-white text-xs px-2 py-1 rounded-full">
                {item.category}
              </span>
            </CardHeader>
            <CardBody className="p-4">
              <h3 className="font-semibold mt-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.name}</p>
              <p className="text-gray-500 text-xs">📍 {item.location}</p>
              <button className="border border-[#12BBB5] text-[#12BBB5] font-medium px-3 py-1 text-xs hover:bg-[#12BBB5] hover:text-white transition mt-3">
                View Details
              </button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerFavorite;
