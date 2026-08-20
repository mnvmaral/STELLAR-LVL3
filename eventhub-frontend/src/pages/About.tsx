import { Navbar } from '../components/Navbar';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About EventHub</h1>
        
        <div className="bg-white rounded-custom-lg shadow-sm p-8 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            EventHub is a modern event management platform designed to connect event organizers 
            with participants in a seamless and efficient way.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Our platform provides a comprehensive solution for discovering, registering, and 
            managing events. Whether you're organizing a cultural festival, sports tournament, 
            tech conference, or educational workshop, EventHub makes it easy to reach your audience 
            and manage registrations.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in the power of events to bring people together, create memorable experiences, 
            and build communities. Our mission is to make event management accessible, efficient, 
            and enjoyable for everyone involved.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Easy event discovery and search</li>
            <li>Quick and secure registration process</li>
            <li>Comprehensive event management tools</li>
            <li>Real-time participant tracking</li>
            <li>Activity timeline and notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
