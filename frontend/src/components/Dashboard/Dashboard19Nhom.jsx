// Dashboard component cho 19 nhóm chuẩn - Auto generated 2025-07-31T19:41:21.127Z
import React, { useState, useEffect } from 'react';
import { NHOM_19_CONFIG, getAllNhom, getTotalEmployees, getCumColors } from '../../config/nhom-19-config.js';

const Dashboard19Nhom = () => {
    const [selectedCum, setSelectedCum] = useState(null);
    const [stats, setStats] = useState({});
    
    useEffect(() => {
        // Load stats from API or calculate from data
        const totalStats = {
            totalEmployees: getTotalEmployees(),
            totalGroups: getAllNhom().length,
            totalCums: Object.keys(NHOM_19_CONFIG).length
        };
        setStats(totalStats);
    }, []);
    
    const colors = getCumColors();
    
    return (
        <div className="dashboard-19-nhom p-6">
            <div className="header mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    📊 Dashboard 19 Nhóm Chuẩn
                </h1>
                <p className="text-gray-600">
                    Hệ thống đánh giá nhân sự theo 5 cụm lớn - {stats.totalEmployees} nhân viên
                </p>
            </div>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Tổng Nhân Viên</h3>
                    <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Số Nhóm</h3>
                    <p className="text-3xl font-bold">{stats.totalGroups}</p>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Cụm Lớn</h3>
                    <p className="text-3xl font-bold">{stats.totalCums}</p>
                </div>
            </div>
            
            {/* Cụm Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(NHOM_19_CONFIG).map(([cumKey, cumData]) => (
                    <div 
                        key={cumKey}
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => setSelectedCum(selectedCum === cumKey ? null : cumKey)}
                        style={{ borderLeft: `4px solid ${colors[cumKey]}` }}
                    >
                        <h3 className="text-xl font-semibold mb-3">{cumData.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{cumData.description}</p>
                        
                        <div className="space-y-2">
                            {cumData.groups.map(group => (
                                <div key={group.id} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">{group.shortName}</span>
                                    <span className="font-semibold text-gray-900">{group.count}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between font-semibold">
                                <span>Tổng cụm:</span>
                                <span>{cumData.groups.reduce((sum, g) => sum + g.count, 0)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Detail Modal */}
            {selectedCum && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{NHOM_19_CONFIG[selectedCum].title}</h2>
                            <button 
                                onClick={() => setSelectedCum(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {NHOM_19_CONFIG[selectedCum].groups.map(group => (
                                <div key={group.id} className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-2">{group.name}</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Thực tế:</span>
                                            <span className="font-medium">{group.count} người</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mục tiêu:</span>
                                            <span className="font-medium">{group.target} người</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Chênh lệch:</span>
                                            <span className={`font-medium ${group.count >= group.target ? 'text-green-600' : 'text-red-600'}`}>
                                                {group.count >= group.target ? '+' : ''}{group.count - group.target}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard19Nhom;
