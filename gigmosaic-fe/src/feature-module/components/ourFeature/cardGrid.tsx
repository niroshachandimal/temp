import Card from './Card';
//import ServiceCard from '../ourFeature/Servicecard';
//import man from '../../../assets/Img/worker-is-cutting-wires-with-lineman-s-pliers.webp';

const services = [
  {
    category: 'Repairs',
    title: 'Appliance Repair Services',
    rating: 4.8,
    reviewsCount: 250,
    price: '$50/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.f-m44aS2UV4nar91daEnVwHaE7%26pid%3DApi&f=1&ipt=086f55bd29d24a9f7fdf812289ae3e11e30000735172623796e3484acb9fcae7&ipo=images',
  },
  {
    category: 'Plumbing',
    title: 'Emergency Plumbing',
    rating: 4.5,
    reviewsCount: 320,
    price: '$60/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.WphG8jNwA5eLBLwkKwFyXwHaE8%26pid%3DApi&f=1&ipt=7c1bb5cd05e6c5349fb07683b3b894170d2d8728cc1f848b33859c9f3afd9e22&ipo=images',
  },
  {
    category: 'Construction',
    title: 'Home Renovation Services',
    rating: 4.7,
    reviewsCount: 180,
    price: '$100/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.zMqtWA38djffbxxf7ERFxwHaE1%26pid%3DApi&f=1&ipt=11f69811411c022f4f989062f8677476123749f104442594c7dff1b3681ce287&ipo=images',
  },
  {
    category: 'Electricians',
    title: 'Residential Electrical Services',
    rating: 4.6,
    reviewsCount: 210,
    price: '$70/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ylo7eN6YjD0ZQXSJeSbaQQHaDX%26pid%3DApi&f=1&ipt=65a41bfa95483f00fb2f9bb63713dd0f3673570c3238ec0e16e36c3f3fef0ad1&ipo=images',
  },
  {
    category: 'Cleaning',
    title: 'Deep Cleaning Services',
    rating: 4.3,
    reviewsCount: 450,
    price: '$40/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.N6Y6sx5Qn1E9uev6PIN2dQHaE8%26pid%3DApi&f=1&ipt=b273cc2d68cff1d83bc9b6a05bffe7786d77f0a350d1436364d65d0a381e1f36&ipo=images',
  },
  {
    category: 'Landscaping',
    title: 'Garden Maintenance',
    rating: 4.2,
    reviewsCount: 190,
    price: '$55/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Jarc3Dp_ln0X10URUN2OlgHaE8%26pid%3DApi&f=1&ipt=fdd6ed1fb0df185a85b6906671d96348928585137364fff302b076851ad6d7f4&ipo=images',
  },
  {
    category: 'Painting',
    title: 'Interior & Exterior Painting',
    rating: 4.9,
    reviewsCount: 300,
    price: '$80/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Bu1Npcw8OlZNfMNXYopBngHaHa%26pid%3DApi&f=1&ipt=49d65d893d6fccdf1409ac09a4e8bae284c3eef4c27ca81b7af18bf4256c13f9&ipo=images',
  },
  {
    category: 'Carpentry',
    title: 'Custom Furniture Making',
    rating: 4.5,
    reviewsCount: 170,
    price: '$90/hour',
    image:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.aAl6dTHRhZtWdRxtqNuRzQHaE6%26pid%3DApi&f=1&ipt=bdace2d07ce95e2d7bc1909632f342a97644a6443cdd334deb93c5ed80c262ec&ipo=images',
  },
];

const CardGrid = () => {
  return (
    <div className="flex justify-center lg:justify-start gap-2 lg:gap-4 mt-5 lg:mt-0">
      {/* Left Side - Service Card */}
      {/* <div className="w-full lg:max-w-[230px]">
        <ServiceCard />
      </div> */}

      {/* Right Column with 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 ml-1 gap-2 w-full my-0">
        {services.map((service, index) => (
          <Card
            key={index}
            category={service.category}
            title={service.title}
            rating={service.rating}
            reviewsCount={service.reviewsCount}
            price={service.price}
            image={service.image}
          />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
