# Cara menjalankan aplikasi
## Dijalankan secara lokal
1.	Pengguna diharuskan mempunyai Python 3.10+ dan Node.js 18.
2.	Pengguna menjalankan "python scripts/setup.py –install" pada folder "backend" dan folder "expression_recognition". Pengguna diharapkan menunggu sampai setiap library berhasil diinstal.
3.	Pengguna menjalankan "npm install" pada folder "frontend" untuk menginstal dependency dari frontend.
4.	Pengguna menjalankan "npm run build" pada folder "frontend" untuk membangun file statik di "backend/views".
5.	Pengguna menjalankan "Venv/Scripts/activate" (jika di Windows) atau "Venv/bin/activate" (jika di Mac atau Linux) untuk mengaktivasi virtual environment di folder "backend" dan "expression_recognition".
6.	Pengguna menjalankan "python scripts/download-models.py" pada folder "expression_recognition" untuk mengunduh model yang diperlukan. Bobot dari model DNN yang telah dilatih di dalam penelitian ini dapat diakses dari https://github.com/DavinTristanIeson/Semester7-DeepLearning/releases/tag/v0.0.0.
7.	Pengguna mengubah semua file *.env.example menjadi file *.env.
8.	Pengguna menjalankan "fastapi run –port 8000" di folder "backend" dan perintah "fastapi run –port 8001" di folder "expression_recognition" untuk mengaktifkan layanan server dan layanan pengenalan ekspresi.
9.	Pengguna mengakses aplikasi dari localhost:8000.

##	Dijalankan menggunakan Docker
1.	Pengguna diharuskan mempunyai Docker 4.0.0+
2.	Pengguna menjalankan "docker compose up" di folder akar. Perintah ini akan mengunduh image Docker dari https://hub.docker.com/repository/docker/davintristan/devops_sem7_server dan https://hub.docker.com/repository/docker/davintristan/devops_sem7_expreg/general. Perlu diperhatikan bahwa ukuran image berpotensial sangat besar.
3.	Setelah Docker berhasil mengunduh image dari DockerHub dan aplikasi sudah mulai dijalankan, maka aplikasi bisa diakses dari localhost:8000.

## Dijalankan menggunakan Minikube
1. Pengguna diharuskan mempunyai Minikube dan Docker 4.0.0+ pada sistem.
2.	Jalankan perintah "minikube start" untuk memulai sebuah cluster Kubernetes lokal di mesin Anda.
3.	Jalankan perintah "minikube addons enable metrics-server" jika ingin melaksanakan Monitoring.
4.	Jalankan perintah "kubectl apply –recursive –f kubecfg" untuk menginisialisasikan cluster Kubernetes sesuai dengan file definisi yang terdapat di folder "kubecfg"
5.	Jalankan perintah "minikube dashboard" untuk mengecek status dari pod di halaman "Pods". Pastikan setiap pod sudah berstatus hijau (sudah aktif).
6.	Jalankan perintah "minikube service service-devops-sem7-server". Perintah ini akan secara otomatis membuka browser untuk mengakses antarmuka aplikasi.

