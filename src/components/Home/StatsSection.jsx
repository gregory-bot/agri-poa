import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Scan, Award, TrendingUp, Globe, Zap } from 'lucide-react';

const StatsSection = () => {
  const [counters, setCounters] = useState({
    farmers: 0,
    scans: 0,
    accuracy: 0,
    countries: 0
  });

  const finalStats = {
    farmers: 15000,
    scans: 250000,
    accuracy: 95,
    countries: 12
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      setCounters(prev => ({
        farmers: Math.min(prev.farmers + Math.ceil(finalStats.farmers / steps), finalStats.farmers),
        scans: Math.min(prev.scans + Math.ceil(finalStats.scans / steps), finalStats.scans),
        accuracy: Math.min(prev.accuracy + Math.ceil(finalStats.accuracy / steps), finalStats.accuracy),
        countries: Math.min(prev.countries + Math.ceil(finalStats.countries / steps), finalStats.countries)
      }));
    }, stepDuration);

    setTimeout(() => clearInterval(interval), duration);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Users,
      value: counters.farmers.toLocaleString(),
      suffix: '+',
      label: 'Active Farmers',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Scan,
      value: counters.scans.toLocaleString(),
      suffix: '+',
      label: 'AI Scans Completed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Award,
      value: counters.accuracy,
      suffix: '%',
      label: 'Accuracy Rate',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Globe,
      value: counters.countries,
      suffix: '+',
      label: 'Countries Served',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Farmers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of farmers who have transformed their agricultural practices with agri-poa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;