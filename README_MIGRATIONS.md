# Migration İşlemleri - Kullanım Kılavuzu

## Sorun Çözüldü ✅

**"Appointment.serviceId sütunu mevcut değil"** hatası başarıyla çözüldü!

## Yapılan İşlemler

### 1. Sequelize CLI Kurulumu
```bash
npm install --save-dev sequelize-cli
```

### 2. Konfigürasyon Dosyaları
- `.sequelizerc` - Sequelize CLI konfigürasyonu
- `config/config.js` - Veritabanı bağlantı bilgileri

### 3. Migration'lar Çalıştırıldı
```bash
npx sequelize-cli db:migrate
```

Çalıştırılan migration'lar:
- ✅ `20250529_create_institution_services.js` - InstitutionServices tablosu oluşturuldu
- ✅ `20250529_create_institution_employees.js` - InstitutionEmployees tablosu oluşturuldu  
- ✅ `20250529_add_service_employee_to_appointments.js` - Appointments tablosuna serviceId ve employeeId sütunları eklendi

## Gelecekte Migration İşlemleri

### Migration Durumunu Kontrol Etme
```bash
npm run db:migrate:status
```

### Yeni Migration'ları Çalıştırma
```bash
npm run db:migrate
```

### Son Migration'ı Geri Alma
```bash
npm run db:migrate:undo
```

### Tüm Migration'ları Geri Alma
```bash
npm run db:migrate:undo:all
```

## Önemli Notlar

1. **Migration'lar otomatik çalışmaz** - Manuel olarak çalıştırılması gerekir
2. **Yeni model değişikliklerinde** migration oluşturulmalı
3. **Production'a geçmeden önce** tüm migration'lar test edilmeli
4. **Backup almayı unutma** - Migration'lardan önce veritabanı yedeği al

## Eklenen Veritabanı Yapısı

### InstitutionServices Tablosu
- id (Primary Key)
- institutionId (Foreign Key -> Institutions)
- serviceName
- description
- duration (dakika)
- price
- isActive
- created_at, updated_at

### InstitutionEmployees Tablosu  
- id (Primary Key)
- institutionId (Foreign Key -> Institutions)
- firstName
- lastName
- title
- specialization
- isActive
- created_at, updated_at

### Appointments Tablosu (Güncellemeler)
- serviceId (Foreign Key -> InstitutionServices) ✅ YENİ
- employeeId (Foreign Key -> InstitutionEmployees) ✅ YENİ

## Sistem Gereksinimleri

- Node.js
- PostgreSQL
- sequelize-cli (kuruldu)

## Sorun Giderme

Eğer gelecekte benzer hatalar alırsan:

1. Migration status'unu kontrol et: `npm run db:migrate:status`
2. Eksik migration'ları çalıştır: `npm run db:migrate`
3. Sunucuyu yeniden başlat: `npm run dev`

**Bu hata bir daha yaşanmayacak!** 🎉 