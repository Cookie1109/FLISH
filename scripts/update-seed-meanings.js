const fs = require('fs');
const file = 'src/services/seed.service.js';
let content = fs.readFileSync(file, 'utf8');

const translations = {
  routine: 'thói quen', habit: 'thói quen', chore: 'việc vặt', grocery: 'hàng tạp hóa',
  commute: 'đi làm', leisure: 'thời gian rảnh', recipe: 'công thức', appliance: 'thiết bị gia dụng',
  budget: 'ngân sách', neighborhood: 'khu phố', weather: 'thời tiết', temperature: 'nhiệt độ',
  exercise: 'tập thể dục', diet: 'chế độ ăn kiêng', relax: 'thư giãn', entertainment: 'giải trí',
  hobby: 'sở thích', conversation: 'cuộc trò chuyện', friendship: 'tình bạn', relative: 'họ hàng',
  appointment: 'cuộc hẹn', schedule: 'lịch trình', priority: 'sự ưu tiên', decision: 'quyết định',
  opportunity: 'cơ hội', challenge: 'thử thách', success: 'thành công', failure: 'thất bại',
  experience: 'kinh nghiệm', memory: 'kỷ niệm',

  meeting: 'cuộc họp', agenda: 'chương trình nghị sự', deadline: 'hạn chót', project: 'dự án',
  contract: 'hợp đồng', client: 'khách hàng', presentation: 'bài thuyết trình', strategy: 'chiến lược',
  profit: 'lợi nhuận', loss: 'thua lỗ', revenue: 'doanh thu', market: 'thị trường', report: 'báo cáo',
  feedback: 'phản hồi', hire: 'tuyển dụng', fire: 'sa thải', promote: 'thăng chức', negotiate: 'đàm phán',
  invest: 'đầu tư', analysis: 'phân tích', asset: 'tài sản', liability: 'trách nhiệm pháp lý',
  shareholder: 'cổ đông', board: 'hội đồng quản trị', equity: 'vốn cổ phần', quarter: 'quý (3 tháng)',
  trend: 'xu hướng', growth: 'sự tăng trưởng', launch: 'ra mắt',

  airport: 'sân bay', flight: 'chuyến bay', ticket: 'vé', passport: 'hộ chiếu', visa: 'thị thực',
  luggage: 'hành lý', hotel: 'khách sạn', reservation: 'đặt phòng', tourist: 'khách du lịch',
  guide: 'hướng dẫn viên', map: 'bản đồ', destination: 'điểm đến', souvenir: 'quà lưu niệm',
  monument: 'đài kỷ niệm', museum: 'bảo tàng', restaurant: 'nhà hàng', menu: 'thực đơn', tip: 'tiền boa',
  taxi: 'xe taxi', subway: 'tàu điện ngầm', train: 'xe lửa', bus: 'xe buýt', station: 'nhà ga',
  delayed: 'bị hoãn', board: 'lên tàu/máy bay', depart: 'khởi hành', arrive: 'đến nơi',
  explore: 'khám phá', sightseeing: 'tham quan ngắm cảnh', customs: 'hải quan'
};

for (const [w, t] of Object.entries(translations)) {
  const regex = new RegExp('{ w: "' + w + '", pos: "[^"]+", ph: "[^"]+", d: "[^"]+"', 'g');
  content = content.replace(regex, (match) => {
    return match.replace(/d: "[^"]+"/, 'd: "' + t + '"');
  });
}

fs.writeFileSync(file, content);
console.log('Seed file updated successfully.');
