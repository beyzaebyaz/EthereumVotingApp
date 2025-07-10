
Bu proje, blockchain teknolojisi kullanılarak geliştirilmiş bir akıllı kontrat uygulamasıdır.

## Kurulum

### Ön Gereksinimler
- Node.js (v14.0.0 veya üzeri)
- npm (v6.0.0 veya üzeri)
- Hardhat
- MetaMask cüzdanı

### Backend Kurulumu

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun ve aşağıdaki değişkenleri kendi bilgilerinizle doldurun:
```env
PRIVATE_KEY="SİZ DOLDURUN"
SEPOLIA_RPC_URL="SİZ DOLDURUN"
```

3. Kontratları derleyin:
```bash
npx hardhat compile
```

4. Test ağında kontratları test edin:
```bash
npx hardhat test
```

5. Kontratları deploy edin:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```


3. Uygulamayı başlatın:
```bash
npm start
```


## Önemli Notlar

1. `.env` dosyası güvenlik nedeniyle  yüklenmemiştir. Kendi `.env` dosyanızı oluşturmanız gerekmektedir.

2. MetaMask kurulumu:
   - MetaMask'ı tarayıcınıza ekleyin
   - Yeni bir hesap oluşturun veya var olan hesabınızı import edin


3. Hardhat kullanımı:
   - Deploy scriptlerini çalıştırırken doğru ağı seçtiğinizden emin olun

4. Güvenlik:
   - Private key'lerinizi asla paylaşmayın
   - `.env` dosyasını asla public repolara yüklemeyin
   - Test için kullanılan hesaplarda minimum miktarda sepolia tutun


