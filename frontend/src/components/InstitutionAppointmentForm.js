import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const InstitutionAppointmentForm = () => {
    const { institutionId } = useParams();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        serviceId: '',
        employeeId: '',
        date: '',
        timeSlot: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchEmployees();
    }, [institutionId]);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`/api/institutions/${institutionId}/services`);
            console.log('Hizmetler:', response.data); // Debug için
            setServices(response.data);
        } catch (error) {
            console.error('Hizmet yükleme hatası:', error);
            setError('Hizmetler yüklenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`/api/institutions/${institutionId}/employees`);
            console.log('Çalışanlar:', response.data); // Debug için
            setEmployees(response.data);
        } catch (error) {
            console.error('Çalışan yükleme hatası:', error);
            setError('Çalışanlar yüklenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submit çalıştı!");
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            console.log('Gönderilecek veri:', formData);
            const response = await axios.post(`/api/appointments/institutions/${institutionId}/appointments`, formData);
            console.log('Randevu oluşturma yanıtı:', response.data);
            setSuccess('Randevu başarıyla oluşturuldu');
            setFormData({
                serviceId: '',
                employeeId: '',
                date: '',
                timeSlot: ''
            });
        } catch (error) {
            console.error('Randevu oluşturma hatası:', error);
            setError(error.response?.data?.message || 'Randevu oluşturulurken bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Yeni Randevu Oluştur</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Hizmet</Form.Label>
                            <Form.Select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleChange}
                                required
                                disabled={loading || services.length === 0}
                            >
                                <option value="">Hizmet Seçin</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {service.price} TL
                                    </option>
                                ))}
                            </Form.Select>
                            {services.length === 0 && (
                                <Form.Text className="text-danger">
                                    Henüz hizmet eklenmemiş
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Çalışan</Form.Label>
                            <Form.Select
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                                disabled={loading || employees.length === 0}
                            >
                                <option value="">Çalışan Seçin</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {employees.length === 0 && (
                                <Form.Text className="text-danger">
                                    Henüz çalışan eklenmemiş
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tarih</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Saat</Form.Label>
                            <Form.Select
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">Saat Seçin</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Randevu Oluşturuluyor...' : 'Randevu Oluştur'}
                </Button>
            </Form>
        </Container>
    );
};

export default InstitutionAppointmentForm; 