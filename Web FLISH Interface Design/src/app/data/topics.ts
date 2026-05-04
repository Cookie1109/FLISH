export interface FlashCard {
  id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  image: string;
  example: string;
  translation: string;
  meaning: string;
}

export interface Topic {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  emoji: string;
  color: string;       // solid bg color for accents
  textColor: string;   // text color on accent bg
  cards: FlashCard[];
}

const IMG = {
  lion: "https://images.unsplash.com/photo-1627486202328-0fc859e0d7e8?w=800&q=80",
  elephant: "https://images.unsplash.com/photo-1631559910372-448c7c3cb262?w=800&q=80",
  butterfly: "https://images.unsplash.com/photo-1656859333228-df4fa7fdacc3?w=800&q=80",
  eagle: "https://images.unsplash.com/photo-1698073118617-03ce7d0f9847?w=800&q=80",
  dolphin: "https://images.unsplash.com/photo-1440020143730-090579c4d53c?w=800&q=80",
  tiger: "https://images.unsplash.com/photo-1575429639137-46f59807b2cd?w=800&q=80",
  giraffe: "https://images.unsplash.com/photo-1571957493901-4cc77844597b?w=800&q=80",
  wildAnimals: "https://images.unsplash.com/photo-1651707265633-6043d4606339?w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1681158924733-784eae8a9f01?w=800&q=80",
  sushi: "https://images.unsplash.com/photo-1700324822763-956100f79b0d?w=800&q=80",
  coffee: "https://images.unsplash.com/photo-1777463984581-5780e9114a1c?w=800&q=80",
  avocado: "https://images.unsplash.com/photo-1555244978-d14a59b24d50?w=800&q=80",
  croissant: "https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?w=800&q=80",
  strawberry: "https://images.unsplash.com/photo-1703957898966-242db2503775?w=800&q=80",
  steak: "https://images.unsplash.com/photo-1587016164135-258b9d6ebdef?w=800&q=80",
  foodDrinks: "https://images.unsplash.com/photo-1611211964942-13da4b6a6963?w=800&q=80",
  passport: "https://images.unsplash.com/photo-1657358846130-3305fd8fcd30?w=800&q=80",
  airplane: "https://images.unsplash.com/photo-1627663412345-aad473f2ba39?w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1776763018821-8feeaeeee0a5?w=800&q=80",
  suitcase: "https://images.unsplash.com/photo-1768668053192-c332ceaf4154?w=800&q=80",
  map: "https://images.unsplash.com/photo-1767382289834-ab498fd06b40?w=800&q=80",
  travel: "https://images.unsplash.com/photo-1775768754591-f58a050f3d8b?w=800&q=80",
  laptop: "https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?w=800&q=80",
  smartphone: "https://images.unsplash.com/photo-1619462729239-ca28ab216892?w=800&q=80",
  ai: "https://images.unsplash.com/photo-1773558057689-847e19466840?w=800&q=80",
  tech: "https://images.unsplash.com/photo-1517077988722-3b02694ac5c5?w=800&q=80",
  meeting: "https://images.unsplash.com/photo-1758691736493-aa6d22c0f8a6?w=800&q=80",
  contract: "https://images.unsplash.com/photo-1670852714979-f73d21652a83?w=800&q=80",
  handshake: "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?w=800&q=80",
  business: "https://images.unsplash.com/photo-1762341117487-dbc411bcf574?w=800&q=80",
  soccer: "https://images.unsplash.com/photo-1473075109809-7a17d327bdf6?w=800&q=80",
  gym: "https://images.unsplash.com/photo-1585484764802-387ea30e8432?w=800&q=80",
  nature: "https://images.unsplash.com/photo-1758099519934-2f00c3e38869?w=800&q=80",
};

export const topics: Topic[] = [
  {
    id: "animals",
    name: "Animals",
    nameVi: "Động vật",
    description: "Từ vựng về các loài động vật trong tự nhiên và cuộc sống",
    emoji: "🐾",
    color: "#EA580C",
    textColor: "#ffffff",
    cards: [
      { id: "a01", word: "Lion", pronunciation: "/ˈlaɪən/", partOfSpeech: "noun", image: IMG.lion, example: "The lion is often called the king of the jungle.", translation: "Sư tử thường được gọi là vua của rừng rậm.", meaning: "Sư tử" },
      { id: "a02", word: "Elephant", pronunciation: "/ˈɛlɪfənt/", partOfSpeech: "noun", image: IMG.elephant, example: "The elephant uses its trunk to drink water and grab food.", translation: "Con voi dùng vòi để uống nước và lấy thức ăn.", meaning: "Con voi" },
      { id: "a03", word: "Butterfly", pronunciation: "/ˈbʌtəflaɪ/", partOfSpeech: "noun", image: IMG.butterfly, example: "A beautiful butterfly landed on the flower in the garden.", translation: "Một con bướm đẹp đậu xuống bông hoa trong vườn.", meaning: "Con bướm" },
      { id: "a04", word: "Eagle", pronunciation: "/ˈiːɡəl/", partOfSpeech: "noun", image: IMG.eagle, example: "The eagle soared high above the mountains with powerful wings.", translation: "Con đại bàng bay vút cao trên những ngọn núi với đôi cánh mạnh mẽ.", meaning: "Đại bàng" },
      { id: "a05", word: "Dolphin", pronunciation: "/ˈdɒlfɪn/", partOfSpeech: "noun", image: IMG.dolphin, example: "Dolphins are known for their intelligence and playful behavior.", translation: "Cá heo được biết đến với trí thông minh và hành vi vui tươi.", meaning: "Cá heo" },
      { id: "a06", word: "Tiger", pronunciation: "/ˈtaɪɡər/", partOfSpeech: "noun", image: IMG.tiger, example: "The tiger is the largest wild cat species in the world.", translation: "Hổ là loài mèo hoang dã lớn nhất trên thế giới.", meaning: "Con hổ" },
      { id: "a07", word: "Giraffe", pronunciation: "/dʒɪˈrɑːf/", partOfSpeech: "noun", image: IMG.giraffe, example: "The giraffe stretched its long neck to reach the top leaves.", translation: "Con hươu cao cổ vươn cổ dài ra để với những chiếc lá trên cao.", meaning: "Hươu cao cổ" },
      { id: "a08", word: "Predator", pronunciation: "/ˈprɛdətər/", partOfSpeech: "noun", image: IMG.tiger, example: "Lions are apex predators that hunt other animals for food.", translation: "Sư tử là loài săn mồi đỉnh cao săn các con vật khác để làm thức ăn.", meaning: "Thú săn mồi" },
      { id: "a09", word: "Endangered", pronunciation: "/ɪnˈdeɪndʒərd/", partOfSpeech: "adjective", image: IMG.wildAnimals, example: "Many species are endangered due to habitat loss and poaching.", translation: "Nhiều loài đang có nguy cơ tuyệt chủng do mất môi trường sống và săn trộm.", meaning: "Có nguy cơ tuyệt chủng" },
      { id: "a10", word: "Migrate", pronunciation: "/ˈmaɪɡreɪt/", partOfSpeech: "verb", image: IMG.eagle, example: "Birds migrate south every autumn to escape the cold winter.", translation: "Chim di cư về phía nam mỗi mùa thu để tránh mùa đông lạnh giá.", meaning: "Di cư" },
      { id: "a11", word: "Camouflage", pronunciation: "/ˈkæməflɑːʒ/", partOfSpeech: "noun", image: IMG.wildAnimals, example: "The chameleon uses camouflage to blend in with its surroundings.", translation: "Con tắc kè hoa dùng ngụy trang để hòa lẫn vào môi trường xung quanh.", meaning: "Ngụy trang" },
      { id: "a12", word: "Hibernate", pronunciation: "/ˈhaɪbərneɪt/", partOfSpeech: "verb", image: IMG.wildAnimals, example: "Bears hibernate during the winter months to survive the cold.", translation: "Gấu ngủ đông vào những tháng mùa đông để sống sót qua cái lạnh.", meaning: "Ngủ đông" },
    ],
  },
  {
    id: "food",
    name: "Food & Drinks",
    nameVi: "Đồ ăn & Thức uống",
    description: "Từ vựng về ẩm thực và đồ uống từ khắp nơi trên thế giới",
    emoji: "🍽️",
    color: "#DC2626",
    textColor: "#ffffff",
    cards: [
      { id: "f01", word: "Pizza", pronunciation: "/ˈpiːtsə/", partOfSpeech: "noun", image: IMG.pizza, example: "She ordered a large pizza for the whole team after work.", translation: "Cô ấy đặt một chiếc pizza lớn cho cả nhóm sau giờ làm.", meaning: "Bánh pizza" },
      { id: "f02", word: "Sushi", pronunciation: "/ˈsuːʃi/", partOfSpeech: "noun", image: IMG.sushi, example: "He tried sushi for the very first time when visiting Japan.", translation: "Anh ấy lần đầu tiên thử sushi khi đến thăm Nhật Bản.", meaning: "Sushi" },
      { id: "f03", word: "Coffee", pronunciation: "/ˈkɒfi/", partOfSpeech: "noun", image: IMG.coffee, example: "I can't start my morning without a warm cup of coffee.", translation: "Tôi không thể bắt đầu buổi sáng mà không có một tách cà phê ấm.", meaning: "Cà phê" },
      { id: "f04", word: "Avocado", pronunciation: "/ˌævəˈkɑːdoʊ/", partOfSpeech: "noun", image: IMG.avocado, example: "She adds sliced avocado to her salad every day for healthy fats.", translation: "Cô ấy thêm bơ thái lát vào salad mỗi ngày để bổ sung chất béo lành mạnh.", meaning: "Quả bơ" },
      { id: "f05", word: "Croissant", pronunciation: "/kwɑːˈsɒŋ/", partOfSpeech: "noun", image: IMG.croissant, example: "They enjoyed warm croissants with butter and jam for breakfast.", translation: "Họ thưởng thức những chiếc croissant nóng với bơ và mứt cho bữa sáng.", meaning: "Bánh sừng bò" },
      { id: "f06", word: "Strawberry", pronunciation: "/ˈstrɔːberi/", partOfSpeech: "noun", image: IMG.strawberry, example: "Fresh strawberries taste best when picked in the early summer.", translation: "Dâu tây tươi ngon nhất khi được hái vào đầu mùa hè.", meaning: "Quả dâu tây" },
      { id: "f07", word: "Steak", pronunciation: "/steɪk/", partOfSpeech: "noun", image: IMG.steak, example: "He ordered a medium-rare steak with fries and salad.", translation: "Anh ấy gọi một miếng bít tết chín vừa kèm khoai tây chiên và salad.", meaning: "Bít tết" },
      { id: "f08", word: "Cuisine", pronunciation: "/kwɪˈziːn/", partOfSpeech: "noun", image: IMG.foodDrinks, example: "Vietnamese cuisine is famous for its fresh herbs and bold flavors.", translation: "Ẩm thực Việt Nam nổi tiếng với các loại rau thơm tươi và hương vị đậm đà.", meaning: "Ẩm thực" },
      { id: "f09", word: "Ingredient", pronunciation: "/ɪnˈɡriːdiənt/", partOfSpeech: "noun", image: IMG.foodDrinks, example: "The secret ingredient in her recipe makes the dish truly special.", translation: "Nguyên liệu bí mật trong công thức của cô ấy làm cho món ăn thực sự đặc biệt.", meaning: "Nguyên liệu" },
      { id: "f10", word: "Appetizer", pronunciation: "/ˈæpɪtaɪzər/", partOfSpeech: "noun", image: IMG.foodDrinks, example: "We ordered three appetizers to share before the main course.", translation: "Chúng tôi gọi ba món khai vị để chia sẻ trước món chính.", meaning: "Món khai vị" },
      { id: "f11", word: "Delicacy", pronunciation: "/ˈdɛlɪkəsi/", partOfSpeech: "noun", image: IMG.sushi, example: "Sea urchin is considered a delicacy in many Asian countries.", translation: "Nhím biển được coi là món đặc sản ở nhiều nước châu Á.", meaning: "Món đặc sản" },
      { id: "f12", word: "Beverage", pronunciation: "/ˈbɛvərɪdʒ/", partOfSpeech: "noun", image: IMG.coffee, example: "The café offers a wide selection of hot and cold beverages.", translation: "Quán cà phê cung cấp nhiều lựa chọn đồ uống nóng và lạnh.", meaning: "Đồ uống" },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    nameVi: "Du lịch",
    description: "Từ vựng thiết yếu khi đi du lịch và khám phá thế giới",
    emoji: "✈️",
    color: "#2563EB",
    textColor: "#ffffff",
    cards: [
      { id: "t01", word: "Passport", pronunciation: "/ˈpɑːspɔːt/", partOfSpeech: "noun", image: IMG.passport, example: "Don't forget to bring your passport when traveling abroad.", translation: "Đừng quên mang theo hộ chiếu khi đi du lịch nước ngoài.", meaning: "Hộ chiếu" },
      { id: "t02", word: "Airplane", pronunciation: "/ˈɛərpleɪn/", partOfSpeech: "noun", image: IMG.airplane, example: "The airplane landed safely at the international airport on time.", translation: "Máy bay đã hạ cánh an toàn tại sân bay quốc tế đúng giờ.", meaning: "Máy bay" },
      { id: "t03", word: "Hotel", pronunciation: "/hoʊˈtɛl/", partOfSpeech: "noun", image: IMG.hotel, example: "We checked into a luxurious hotel near the beach for our trip.", translation: "Chúng tôi nhận phòng tại một khách sạn sang trọng gần bãi biển.", meaning: "Khách sạn" },
      { id: "t04", word: "Suitcase", pronunciation: "/ˈsuːtkeɪs/", partOfSpeech: "noun", image: IMG.suitcase, example: "She packed her suitcase carefully the night before the flight.", translation: "Cô ấy đóng gói vali cẩn thận vào tối trước chuyến bay.", meaning: "Va li" },
      { id: "t05", word: "Itinerary", pronunciation: "/aɪˈtɪnəreri/", partOfSpeech: "noun", image: IMG.map, example: "Our travel itinerary includes visits to five different countries.", translation: "Lịch trình du lịch của chúng tôi bao gồm việc ghé thăm năm quốc gia khác nhau.", meaning: "Lịch trình" },
      { id: "t06", word: "Destination", pronunciation: "/ˌdɛstɪˈneɪʃən/", partOfSpeech: "noun", image: IMG.travel, example: "Paris is one of the most popular tourist destinations in the world.", translation: "Paris là một trong những điểm đến du lịch phổ biến nhất thế giới.", meaning: "Điểm đến" },
      { id: "t07", word: "Departure", pronunciation: "/dɪˈpɑːtʃər/", partOfSpeech: "noun", image: IMG.airplane, example: "The departure time is 6 AM so we need to arrive by 4 AM.", translation: "Giờ khởi hành là 6 giờ sáng nên chúng ta cần đến vào lúc 4 giờ sáng.", meaning: "Giờ khởi hành" },
      { id: "t08", word: "Customs", pronunciation: "/ˈkʌstəmz/", partOfSpeech: "noun", image: IMG.passport, example: "All passengers must go through customs before entering the country.", translation: "Tất cả hành khách phải qua hải quan trước khi vào quốc gia.", meaning: "Hải quan" },
      { id: "t09", word: "Souvenir", pronunciation: "/ˌsuːvəˈnɪər/", partOfSpeech: "noun", image: IMG.travel, example: "She bought a small souvenir from every country she visited.", translation: "Cô ấy mua một món quà lưu niệm nhỏ từ mỗi quốc gia mình đến thăm.", meaning: "Quà lưu niệm" },
      { id: "t10", word: "Backpacker", pronunciation: "/ˈbækpækər/", partOfSpeech: "noun", image: IMG.travel, example: "As a backpacker, she traveled across Southeast Asia on a budget.", translation: "Là một người du lịch bụi, cô ấy đi khắp Đông Nam Á với ngân sách ít ỏi.", meaning: "Người du lịch bụi" },
      { id: "t11", word: "Layover", pronunciation: "/ˈleɪoʊvər/", partOfSpeech: "noun", image: IMG.airplane, example: "We had a three-hour layover in Singapore before our next flight.", translation: "Chúng tôi có ba giờ quá cảnh tại Singapore trước chuyến bay tiếp theo.", meaning: "Quá cảnh" },
      { id: "t12", word: "Boarding pass", pronunciation: "/ˈbɔːrdɪŋ pæs/", partOfSpeech: "noun", image: IMG.passport, example: "Please have your boarding pass ready before entering the gate.", translation: "Hãy chuẩn bị sẵn thẻ lên máy bay trước khi vào cửa lên máy bay.", meaning: "Thẻ lên máy bay" },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    nameVi: "Công nghệ",
    description: "Từ vựng về công nghệ và thế giới số hiện đại",
    emoji: "💻",
    color: "#7C3AED",
    textColor: "#ffffff",
    cards: [
      { id: "tech01", word: "Laptop", pronunciation: "/ˈlæptɒp/", partOfSpeech: "noun", image: IMG.laptop, example: "She bought a new laptop for her online classes and remote work.", translation: "Cô ấy mua một chiếc laptop mới cho các lớp học trực tuyến và làm việc từ xa.", meaning: "Máy tính xách tay" },
      { id: "tech02", word: "Smartphone", pronunciation: "/ˈsmɑːtfoʊn/", partOfSpeech: "noun", image: IMG.smartphone, example: "Smartphones have completely changed the way we communicate daily.", translation: "Điện thoại thông minh đã hoàn toàn thay đổi cách chúng ta giao tiếp hàng ngày.", meaning: "Điện thoại thông minh" },
      { id: "tech03", word: "Algorithm", pronunciation: "/ˈælɡərɪðəm/", partOfSpeech: "noun", image: IMG.tech, example: "The algorithm processes millions of data points in just one second.", translation: "Thuật toán xử lý hàng triệu điểm dữ liệu chỉ trong một giây.", meaning: "Thuật toán" },
      { id: "tech04", word: "Artificial Intelligence", pronunciation: "/ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/", partOfSpeech: "noun", image: IMG.ai, example: "Artificial intelligence is transforming every industry around the world.", translation: "Trí tuệ nhân tạo đang làm thay đổi mọi ngành công nghiệp trên thế giới.", meaning: "Trí tuệ nhân tạo" },
      { id: "tech05", word: "Cybersecurity", pronunciation: "/ˌsaɪbəsɪˈkjʊərɪti/", partOfSpeech: "noun", image: IMG.laptop, example: "Strong cybersecurity protects businesses from hackers and data breaches.", translation: "An ninh mạng mạnh mẽ bảo vệ doanh nghiệp khỏi tin tặc và vi phạm dữ liệu.", meaning: "An ninh mạng" },
      { id: "tech06", word: "Database", pronunciation: "/ˈdeɪtəbeɪs/", partOfSpeech: "noun", image: IMG.tech, example: "The company stores all customer information in a secure database.", translation: "Công ty lưu trữ tất cả thông tin khách hàng trong một cơ sở dữ liệu bảo mật.", meaning: "Cơ sở dữ liệu" },
      { id: "tech07", word: "Software", pronunciation: "/ˈsɒftweər/", partOfSpeech: "noun", image: IMG.laptop, example: "The new software update fixed several bugs and improved performance.", translation: "Bản cập nhật phần mềm mới đã sửa một số lỗi và cải thiện hiệu suất.", meaning: "Phần mềm" },
      { id: "tech08", word: "Cloud computing", pronunciation: "/klaʊd kəmˈpjuːtɪŋ/", partOfSpeech: "noun", image: IMG.tech, example: "Cloud computing allows users to store and access data from anywhere.", translation: "Điện toán đám mây cho phép người dùng lưu trữ và truy cập dữ liệu từ bất kỳ đâu.", meaning: "Điện toán đám mây" },
      { id: "tech09", word: "Bandwidth", pronunciation: "/ˈbændwɪdθ/", partOfSpeech: "noun", image: IMG.tech, example: "Streaming in 4K requires a high bandwidth internet connection.", translation: "Xem trực tuyến ở độ phân giải 4K cần kết nối internet có băng thông cao.", meaning: "Băng thông" },
      { id: "tech10", word: "Interface", pronunciation: "/ˈɪntəfeɪs/", partOfSpeech: "noun", image: IMG.smartphone, example: "The app has a clean and intuitive interface that anyone can use.", translation: "Ứng dụng có giao diện gọn gàng và trực quan mà bất kỳ ai cũng có thể sử dụng.", meaning: "Giao diện" },
      { id: "tech11", word: "Encryption", pronunciation: "/ɪnˈkrɪpʃən/", partOfSpeech: "noun", image: IMG.laptop, example: "End-to-end encryption ensures that your messages remain private.", translation: "Mã hóa đầu cuối đảm bảo rằng tin nhắn của bạn luôn được giữ bí mật.", meaning: "Mã hóa" },
      { id: "tech12", word: "Prototype", pronunciation: "/ˈprəʊtətaɪp/", partOfSpeech: "noun", image: IMG.tech, example: "The engineering team built a prototype to test the new product design.", translation: "Nhóm kỹ thuật đã xây dựng nguyên mẫu để kiểm tra thiết kế sản phẩm mới.", meaning: "Nguyên mẫu" },
    ],
  },
  {
    id: "business",
    name: "Business",
    nameVi: "Kinh doanh",
    description: "Từ vựng chuyên ngành kinh doanh và môi trường công sở",
    emoji: "💼",
    color: "#0F766E",
    textColor: "#ffffff",
    cards: [
      { id: "b01", word: "Meeting", pronunciation: "/ˈmiːtɪŋ/", partOfSpeech: "noun", image: IMG.meeting, example: "We have an important meeting with the client scheduled for tomorrow.", translation: "Chúng ta có một cuộc họp quan trọng với khách hàng được lên lịch vào ngày mai.", meaning: "Cuộc họp" },
      { id: "b02", word: "Contract", pronunciation: "/ˈkɒntrækt/", partOfSpeech: "noun", image: IMG.contract, example: "Both parties signed the contract after reviewing all the terms carefully.", translation: "Cả hai bên đã ký hợp đồng sau khi xem xét kỹ lưỡng tất cả các điều khoản.", meaning: "Hợp đồng" },
      { id: "b03", word: "Negotiate", pronunciation: "/nɪˈɡoʊʃieɪt/", partOfSpeech: "verb", image: IMG.handshake, example: "They had to negotiate the price before reaching a final agreement.", translation: "Họ phải đàm phán giá cả trước khi đạt được thỏa thuận cuối cùng.", meaning: "Đàm phán" },
      { id: "b04", word: "Entrepreneur", pronunciation: "/ˌɒntrəprəˈnɜː/", partOfSpeech: "noun", image: IMG.business, example: "The young entrepreneur launched a successful startup at just 22 years old.", translation: "Doanh nhân trẻ đã ra mắt một công ty khởi nghiệp thành công chỉ ở tuổi 22.", meaning: "Doanh nhân" },
      { id: "b05", word: "Investment", pronunciation: "/ɪnˈvɛstmənt/", partOfSpeech: "noun", image: IMG.contract, example: "A smart investment today can lead to significant financial gains in the future.", translation: "Một khoản đầu tư thông minh hôm nay có thể dẫn đến lợi nhuận tài chính đáng kể.", meaning: "Đầu tư" },
      { id: "b06", word: "Revenue", pronunciation: "/ˈrɛvənjuː/", partOfSpeech: "noun", image: IMG.business, example: "The company reported record revenue in the third quarter of this year.", translation: "Công ty báo cáo doanh thu kỷ lục trong quý ba của năm nay.", meaning: "Doanh thu" },
      { id: "b07", word: "Stakeholder", pronunciation: "/ˈsteɪkhoʊldər/", partOfSpeech: "noun", image: IMG.meeting, example: "All stakeholders must be informed before making major company decisions.", translation: "Tất cả các bên liên quan phải được thông báo trước khi đưa ra quyết định lớn của công ty.", meaning: "Các bên liên quan" },
      { id: "b08", word: "Deadline", pronunciation: "/ˈdɛdlaɪn/", partOfSpeech: "noun", image: IMG.meeting, example: "The team worked overtime to meet the project deadline on Friday.", translation: "Nhóm làm việc ngoài giờ để đáp ứng thời hạn dự án vào thứ Sáu.", meaning: "Hạn chót" },
      { id: "b09", word: "Strategy", pronunciation: "/ˈstrætɪdʒi/", partOfSpeech: "noun", image: IMG.business, example: "The CEO presented a new marketing strategy to attract younger customers.", translation: "Giám đốc điều hành trình bày chiến lược tiếp thị mới để thu hút khách hàng trẻ hơn.", meaning: "Chiến lược" },
      { id: "b10", word: "Proposal", pronunciation: "/prəˈpoʊzəl/", partOfSpeech: "noun", image: IMG.contract, example: "She submitted a detailed business proposal to secure the funding.", translation: "Cô ấy đã gửi một đề xuất kinh doanh chi tiết để đảm bảo nguồn tài trợ.", meaning: "Đề xuất" },
      { id: "b11", word: "Collaborate", pronunciation: "/kəˈlæbəreɪt/", partOfSpeech: "verb", image: IMG.handshake, example: "The two companies decided to collaborate on the new product launch.", translation: "Hai công ty quyết định hợp tác trong việc ra mắt sản phẩm mới.", meaning: "Hợp tác" },
      { id: "b12", word: "Profit margin", pronunciation: "/ˈprɒfɪt ˌmɑːdʒɪn/", partOfSpeech: "noun", image: IMG.business, example: "Reducing costs helped the company increase its profit margin significantly.", translation: "Giảm chi phí đã giúp công ty tăng đáng kể biên lợi nhuận của mình.", meaning: "Biên lợi nhuận" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    nameVi: "Thể thao",
    description: "Từ vựng về các môn thể thao và hoạt động thể chất",
    emoji: "⚽",
    color: "#16A34A",
    textColor: "#ffffff",
    cards: [
      { id: "s01", word: "Champion", pronunciation: "/ˈtʃæmpiən/", partOfSpeech: "noun", image: IMG.soccer, example: "She became the national swimming champion after years of hard training.", translation: "Cô ấy trở thành nhà vô địch bơi lội quốc gia sau nhiều năm luyện tập chăm chỉ.", meaning: "Nhà vô địch" },
      { id: "s02", word: "Tournament", pronunciation: "/ˈtʊənəmənt/", partOfSpeech: "noun", image: IMG.soccer, example: "The international tennis tournament attracts players from over 50 countries.", translation: "Giải quần vợt quốc tế thu hút các vận động viên từ hơn 50 quốc gia.", meaning: "Giải đấu" },
      { id: "s03", word: "Endurance", pronunciation: "/ɪnˈdjʊərəns/", partOfSpeech: "noun", image: IMG.gym, example: "Running a marathon requires incredible endurance and mental strength.", translation: "Chạy marathon đòi hỏi sức bền phi thường và sức mạnh tinh thần.", meaning: "Sức bền" },
      { id: "s04", word: "Stadium", pronunciation: "/ˈsteɪdiəm/", partOfSpeech: "noun", image: IMG.soccer, example: "The stadium was packed with thousands of excited fans during the final.", translation: "Sân vận động chật kín hàng nghìn người hâm mộ phấn khích trong trận chung kết.", meaning: "Sân vận động" },
      { id: "s05", word: "Athlete", pronunciation: "/ˈæθliːt/", partOfSpeech: "noun", image: IMG.gym, example: "Professional athletes train for several hours every single day.", translation: "Vận động viên chuyên nghiệp luyện tập nhiều giờ mỗi ngày.", meaning: "Vận động viên" },
      { id: "s06", word: "Coach", pronunciation: "/koʊtʃ/", partOfSpeech: "noun", image: IMG.gym, example: "A good coach pushes athletes to reach their full potential.", translation: "Một huấn luyện viên giỏi thúc đẩy các vận động viên đạt được tiềm năng đầy đủ của họ.", meaning: "Huấn luyện viên" },
      { id: "s07", word: "Referee", pronunciation: "/ˌrɛfəˈriː/", partOfSpeech: "noun", image: IMG.soccer, example: "The referee blew the whistle to signal the end of the match.", translation: "Trọng tài thổi còi để báo hiệu kết thúc trận đấu.", meaning: "Trọng tài" },
      { id: "s08", word: "Penalty", pronunciation: "/ˈpɛnəlti/", partOfSpeech: "noun", image: IMG.soccer, example: "The team won the cup after scoring in a penalty shootout.", translation: "Đội đã giành cúp sau khi ghi bàn trong loạt sút penalty.", meaning: "Hình phạt / Phạt đền" },
      { id: "s09", word: "Sprint", pronunciation: "/sprɪnt/", partOfSpeech: "verb", image: IMG.gym, example: "He sprinted to the finish line and broke the national record.", translation: "Anh ấy chạy nước rút đến vạch đích và phá kỷ lục quốc gia.", meaning: "Chạy nước rút" },
      { id: "s10", word: "Warm-up", pronunciation: "/ˈwɔːmʌp/", partOfSpeech: "noun", image: IMG.gym, example: "Always do a proper warm-up before starting any intense exercise.", translation: "Luôn khởi động đúng cách trước khi bắt đầu bất kỳ bài tập cường độ cao nào.", meaning: "Khởi động" },
    ],
  },
];

export const getTopicById = (id: string) => topics.find((t) => t.id === id);

export const getAllLearnedStats = () => {
  return topics.map((topic) => {
    const key = `flish-learned-${topic.id}`;
    try {
      const stored = localStorage.getItem(key);
      const learnedIds: string[] = stored ? JSON.parse(stored) : [];
      return { topicId: topic.id, learned: learnedIds.length, total: topic.cards.length };
    } catch {
      return { topicId: topic.id, learned: 0, total: topic.cards.length };
    }
  });
};
