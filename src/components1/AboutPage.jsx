import React from 'react';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiTruck,
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiTwitter 
} from 'react-icons/fi';
import { 
  BiStore, 
  BiRuler 
} from 'react-icons/bi';
import { GiClothes } from 'react-icons/gi';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "John Doe",
      location: "New York",
      description: "Senior Fashion Stylist with over 10 years of experience in luxury fashion",
      image: "/api/placeholder/300/300",
      social: {
        instagram: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Jane Smith",
      location: "Paris",
      description: "Creative Director specialized in sustainable and ethical fashion",
      image: "/api/placeholder/300/300",
      social: {
        instagram: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Alex Johnson",
      location: "London",
      description: "Fashion Tech Innovation Lead with expertise in digital styling",
      image: "/api/placeholder/300/300",
      social: {
        instagram: "#",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Light, Fast & Powerful Services
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                At our platform, we offer a seamless experience designed to cater to two types of users: customers and stylists.
              </p>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Whether you're looking to upgrade your wardrobe or take your styling career to the next level, we've got you covered. With our platform, fashion has never been more accessible, efficient, and powerful.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <FiUsers className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Customers</h3>
                  <p className="text-gray-600 leading-relaxed">Discover the latest trends and shop with confidence. Our platform makes it fast to browse, select, and receive your favorite both locally and internationally.</p>
                </div>
                <div className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <GiClothes className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Stylists</h3>
                  <p className="text-gray-600 leading-relaxed">Empower your creativity and grow your business with our styling tools. Connect with clients, showcase your work, and manage your bookings effortlessly.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative flex justify-center gap-8">
                <img src="/api/placeholder/300/300" alt="Stylist" className="w-56 h-56 rounded-2xl object-cover shadow-xl transform -rotate-6" />
                <img src="/api/placeholder/300/300" alt="Fashion Professional" className="w-56 h-56 rounded-2xl object-cover shadow-xl transform rotate-6 mt-16" />
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-32">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            What we do
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiShoppingCart className="w-8 h-8" />,
                title: "Shop Latest Wears",
                description: "Explore curated collections from top designers and emerging brands.",
                color: "blue"
              },
              {
                icon: <BiRuler className="w-8 h-8" />,
                title: "Custom Measurements",
                description: "Get perfectly fitted clothes with our precise measurement system.",
                color: "purple"
              },
              {
                icon: <BiStore className="w-8 h-8" />,
                title: "Sell Your Wears",
                description: "Join our marketplace and reach fashion enthusiasts worldwide.",
                color: "indigo"
              },
              {
                icon: <FiTruck className="w-8 h-8" />,
                title: "Fast Delivery",
                description: "Enjoy quick and reliable shipping to your doorstep.",
                color: "pink"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  <div className={`text-${feature.color}-600`}>{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative group">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex gap-4 justify-center">
                        <a href={member.social.instagram} className="text-white hover:text-blue-400 transition-colors">
                          <FiInstagram className="w-6 h-6" />
                        </a>
                        <a href={member.social.linkedin} className="text-white hover:text-blue-400 transition-colors">
                          <FiLinkedin className="w-6 h-6" />
                        </a>
                        <a href={member.social.twitter} className="text-white hover:text-blue-400 transition-colors">
                          <FiTwitter className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    {member.location}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;