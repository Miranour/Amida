import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InstitutionSettings = () => {
    const [settings, setSettings] = useState({
        description: '',
        website: '',
        socialMedia: {},
        appointmentDuration: 30,
        maxAppointmentsPerDay: 20,
        breakTime: [],
        holidays: [],
        notificationSettings: {},
        emailNotifications: true,
        smsNotifications: false
    });
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/institution/settings');
            setSettings(response.data);
            if (response.data.logo) {
                setLogoPreview(response.data.logo);
            }
        } catch (error) {
            toast.error('Ayarlar yüklenirken bir hata oluştu');
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleLogoUpload = async () => {
        if (!logo) return;

        const formData = new FormData();
        formData.append('logo', logo);

        try {
            setLoading(true);
            const response = await axios.post('/api/institution/upload-logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Logo başarıyla güncellendi');
            setLogoPreview(response.data.logoUrl);
            setLogo(null);
        } catch (error) {
            toast.error('Logo yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotosChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);
        setPhotoPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handlePhotosUpload = async () => {
        if (photos.length === 0) return;
        const formData = new FormData();
        photos.forEach(photo => formData.append('photos', photo));
        try {
            setLoading(true);
            const response = await axios.post('/api/institution/upload-photos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Fotoğraflar başarıyla yüklendi');
            setPhotoPreviews(response.data.photos);
            setPhotos([]);
        } catch (error) {
            toast.error('Fotoğraflar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.put('/api/institution/settings', settings);
            toast.success('Ayarlar başarıyla güncellendi');
        } catch (error) {
            toast.error('Ayarlar güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Kurum Ayarları</h2>
            
            {/* Logo Yükleme Bölümü */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Kurum Logosu</h3>
                <div className="flex items-center space-x-4">
                    {logoPreview && (
                        <img 
                            src={logoPreview} 
                            alt="Kurum Logosu" 
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    )}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="mb-2"
                        />
                        <button
                            onClick={handleLogoUpload}
                            disabled={!logo || loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {loading ? 'Yükleniyor...' : 'Logo Yükle'}
                        </button>
                    </div>
                </div>
            </div>

            {/* İşyeri Fotoğrafları Yükleme Bölümü */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">İşyeri Fotoğrafları</h3>
                <div className="flex flex-wrap gap-4 mb-2">
                    {photoPreviews.map((src, idx) => (
                        <img key={idx} src={src} alt={`İşyeri Fotoğrafı ${idx+1}`} className="w-32 h-32 object-cover rounded-lg" />
                    ))}
                </div>
                <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handlePhotosChange}
                    className="mb-2"
                />
                <button
                    onClick={handlePhotosUpload}
                    disabled={photos.length === 0 || loading}
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Yükleniyor...' : 'Fotoğrafları Yükle'}
                </button>
            </div>

            {/* Diğer Ayarlar Formu */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... Mevcut form alanları ... */}
            </form>
        </div>
    );
};

export default InstitutionSettings; 