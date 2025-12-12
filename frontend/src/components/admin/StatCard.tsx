import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    iconBgColor?: string;
    iconColor?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, iconBgColor = 'bg-blue-100', iconColor = 'text-blue-600' }: StatCardProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-semibold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                            <span className="text-sm text-gray-500">from last month</span>
                        </div>
                    )}
                </div>
                <div className={`${iconBgColor} ${iconColor} p-3 rounded-full`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
