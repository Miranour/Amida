# Amida - Randevu Yönetim Sistemi

Amida, kurumlar ve kullanıcılar için geliştirilmiş modern bir randevu yönetim sistemidir. Kurumlar randevu saatlerini belirleyebilir, kullanıcılar ise bu saatler arasından seçim yaparak randevu oluşturabilir.

## Özellikler

- 🔐 Güvenli kullanıcı ve kurum girişi
- 📅 Randevu oluşturma ve yönetme
- 🏢 Kurum profil yönetimi
- 👥 Kullanıcı profil yönetimi
- 📱 Responsive tasarım
- 🔔 Randevu bildirimleri

## Teknolojiler

- **Backend:**
  - Node.js
  - Express.js
  - Sequelize ORM
  - MySQL/PostgreSQL
  - JWT Authentication

- **Frontend:**
  - React.js
  - Material-UI
  - Axios
  - React Router

## Kurulum

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/Miranour/Amida.git
   cd Amida
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Veritabanı ayarlarını yapın:
   - `config/database.js` dosyasını düzenleyin
   - Veritabanı bilgilerinizi girin (kullanıcı adı, şifre, veritabanı adı)

4. Veritabanı tablolarını oluşturun:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## Kullanım

### Kurumlar İçin
1. Kurum hesabı oluşturun
2. Profil bilgilerinizi girin
3. Randevu saatlerinizi belirleyin
4. Randevuları yönetin

### Kullanıcılar İçin
1. Kullanıcı hesabı oluşturun
2. Profil bilgilerinizi girin
3. Randevu almak istediğiniz kurumu seçin
4. Uygun randevu saatini seçin
5. Randevunuzu onaylayın

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## Lisans

Bu proje henüz bir lisans altında değildir. Lisans seçimi için [issue](https://github.com/Miranour/Amida/issues) açabilirsiniz.

## İletişim

Sorularınız veya önerileriniz için GitHub üzerinden issue açabilirsiniz. 