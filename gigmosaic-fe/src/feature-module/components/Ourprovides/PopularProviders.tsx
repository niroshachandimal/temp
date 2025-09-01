import { useTranslation } from 'react-i18next';
import { AiFillStar } from 'react-icons/ai';

const PopularProviders = () => {
  const { t } = useTranslation();

  const dummyData = [
    {
      id: 1,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.n6gAg4W6tb7N8xxwN8ULSQHaE7%26pid%3DApi&f=1&ipt=b03b6d76cf99ba63d51627c4468eacf7ea16a448077f54b38e9d7344f873e2dc&ipo=images',
      category: 'Home Cleaning',
      title: 'Professional House Cleaning',
      price: '$80',
      rating: 4.9,
      reviews: 234,
      location: 'New York, USA',
      provider: {
        name: 'John Smith',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.YIre5HGHiqBa7DCmrF4KwwHaJQ%26pid%3DApi&f=1&ipt=f18c8d996ea6575f46d0e261d0c20d361edf51a248aa1e3ad9adf7a28c810c84&ipo=images',
        verified: true
      }
    },
    {
      id: 2,
      image: 'https://sanfranciscopost.com/wp-content/uploads/2024/02/C40.jpg',
      category: 'Electrical',
      title: 'Expert Electrical Services',
      price: '$120',
      rating: 4.8,
      reviews: 189,
      location: 'Los Angeles, USA',
      provider: {
        name: 'Sarah Wilson',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.sc8fbAL8kLwdLcfPWi_zjgHaHa%26pid%3DApi&f=1&ipt=4f3d2ebffb031c79598390f87790c11d6448a0cbc18a53533987a5c3be763408&ipo=images',
        verified: true
      }
    },
    {
      id: 3,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.Qe7FRwCk6DvamPSsYBDkAAHaEC%26pid%3DApi&f=1&ipt=d2029ef5889fce89c177751fc6dfddba185405347c6d7200ad1af8a9dae926f7&ipo=images',
      category: 'Plumbing',
      title: '24/7 Emergency Plumbing',
      price: '$95',
      rating: 4.7,
      reviews: 156,
      location: 'Chicago, USA',
      provider: {
        name: 'Mike Johnson',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KUAsmNfV85UItUpT4yppeAHaHa%26pid%3DApi&f=1&ipt=411db40d19ad0fa1226e4bb0144db058f10c2742d5a6429fea4d23e2621eaaae&ipo=images',
        verified: true
      }
    },
    {
      id: 4,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.5uVT_wAtvVD27mElhyzDRQHaEf%26pid%3DApi&f=1&ipt=188b5d85f34cedf9bb45b50cffd65e5ebcb32b12d1edf198060bb1bd4ec89a02&ipo=images',
      category: 'Carpentry',
      title: 'Custom Furniture Making',
      price: '$150',
      rating: 5.0,
      reviews: 203,
      location: 'Miami, USA',
      provider: {
        name: 'David Brown',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fface-portrait-casual-middleaged-man-white-square-background-generative-ai_741672-1331.jpg&f=1&nofb=1&ipt=d6bcb498292d3f4e572782429c36bcb41460bde7b61af829ecc99af5590275ce&ipo=images',
        verified: true
      }
    }
  ];

  return (
    <div className="my-8">
      <div className="flex items-center justify-between font-montserrat text-md font-bold mt-10 border-b-1 border-gray-400/80 pb-1 mb-2">
      <span>{t('Popular_Service_Providers')}</span>
      <button className="px-4 min-h-7 h-7 text-sm font-semibold text-white bg-teal-500 rounded-sm cursor-pointer border-[none] max-md:w-full">
        {t('view_all')}
      </button>
    </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyData.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm">
                {item.category}
              </span>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={item.provider.image}
                  alt={item.provider.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-sm">{item.provider.name}</h3>
                  <div className="flex items-center gap-1">
                    <AiFillStar className="text-yellow-400" />
                    <span className="text-sm">{item.rating}</span>
                    <span className="text-gray-500 text-sm">({item.reviews})</span>
                  </div>
                </div>
              </div>
              
              <h5 className="font-medium mb-2">{item.title}</h5>
              <div className="flex items-center justify-between">
                <span className="text-primary font-semibold">{item.price}</span>
                <span className="text-sm text-gray-500">{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProviders;
