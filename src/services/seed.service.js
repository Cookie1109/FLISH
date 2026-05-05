const { Topic, Flashcard, sequelize } = require("../models");

const DEFAULT_IMAGE = process.env.DEFAULT_CARD_IMAGE_URL || "/images/default-placeholder.jpg";

const SEED_DATA = [
  {
    name: "🌿 Daily Life",
    description: "Từ vựng tiếng Anh giao tiếp thường ngày",
    thumbnailUrl: "https://images.unsplash.com/photo-1506784951206-538d5f303d21?q=80&w=400&auto=format&fit=crop",
    isPublic: false,
    words: [
      { w: "routine", pos: "noun", ph: "/ruːˈtiːn/", d: "thói quen", ex: "It's part of my morning routine.", ext: "Đó là một phần của thói quen buổi sáng của tôi." },
      { w: "habit", pos: "noun", ph: "/ˈhæb.ɪt/", d: "thói quen", ex: "He has a habit of biting his nails.", ext: "Anh ấy có thói quen cắn móng tay." },
      { w: "chore", pos: "noun", ph: "/tʃɔːr/", d: "việc vặt", ex: "Doing chores is not my favorite thing.", ext: "Làm việc nhà không phải là sở thích của tôi." },
      { w: "grocery", pos: "noun", ph: "/ˈɡroʊ.sɚ.i/", d: "hàng tạp hóa", ex: "I need to buy groceries for the week.", ext: "Tôi cần mua tạp hóa cho cả tuần." },
      { w: "commute", pos: "verb", ph: "/kəˈmjuːt/", d: "đi làm", ex: "She commutes to the city every day.", ext: "Cô ấy đi làm vào thành phố mỗi ngày." },
      { w: "leisure", pos: "noun", ph: "/ˈliː.ʒɚ/", d: "thời gian rảnh", ex: "What do you do in your leisure time?", ext: "Bạn làm gì trong thời gian rảnh rỗi?" },
      { w: "recipe", pos: "noun", ph: "/ˈres.ə.pi/", d: "công thức", ex: "This cake recipe is very easy.", ext: "Công thức làm bánh này rất dễ." },
      { w: "appliance", pos: "noun", ph: "/əˈplaɪ.əns/", d: "thiết bị gia dụng", ex: "We bought some new kitchen appliances.", ext: "Chúng tôi đã mua một số thiết bị nhà bếp mới." },
      { w: "budget", pos: "noun", ph: "/ˈbʌdʒ.ɪt/", d: "ngân sách", ex: "We need to stick to our monthly budget.", ext: "Chúng ta cần tuân thủ ngân sách hàng tháng." },
      { w: "neighborhood", pos: "noun", ph: "/ˈneɪ.bɚ.hʊd/", d: "khu phố", ex: "It's a quiet and friendly neighborhood.", ext: "Đó là một khu phố yên tĩnh và thân thiện." },
      { w: "weather", pos: "noun", ph: "/ˈweð.ɚ/", d: "thời tiết", ex: "The weather is lovely today.", ext: "Thời tiết hôm nay rất đẹp." },
      { w: "temperature", pos: "noun", ph: "/ˈtem.pɚ.ə.tʃɚ/", d: "nhiệt độ", ex: "The temperature dropped significantly.", ext: "Nhiệt độ đã giảm đáng kể." },
      { w: "exercise", pos: "noun", ph: "/ˈek.sɚ.saɪz/", d: "tập thể dục", ex: "Regular exercise is good for your health.", ext: "Tập thể dục thường xuyên rất tốt cho sức khỏe." },
      { w: "diet", pos: "noun", ph: "/ˈdaɪ.ət/", d: "chế độ ăn kiêng", ex: "She follows a strict vegetarian diet.", ext: "Cô ấy tuân theo một chế độ ăn chay nghiêm ngặt." },
      { w: "relax", pos: "verb", ph: "/rɪˈlæks/", d: "thư giãn", ex: "I like to relax by reading a book.", ext: "Tôi thích thư giãn bằng cách đọc sách." },
      { w: "entertainment", pos: "noun", ph: "/en.t̬ɚˈteɪn.mənt/", d: "giải trí", ex: "There wasn't much entertainment in the town.", ext: "Không có nhiều hoạt động giải trí trong thị trấn." },
      { w: "hobby", pos: "noun", ph: "/ˈhɑː.bi/", d: "sở thích", ex: "My main hobby is photography.", ext: "Sở thích chính của tôi là nhiếp ảnh." },
      { w: "conversation", pos: "noun", ph: "/ˌkɑːn.vɚˈseɪ.ʃən/", d: "cuộc trò chuyện", ex: "We had a long conversation about politics.", ext: "Chúng tôi đã có một cuộc trò chuyện dài về chính trị." },
      { w: "friendship", pos: "noun", ph: "/ˈfrend.ʃɪp/", d: "tình bạn", ex: "Their friendship has lasted for years.", ext: "Tình bạn của họ đã kéo dài nhiều năm." },
      { w: "relative", pos: "noun", ph: "/ˈrel.ə.t̬ɪv/", d: "họ hàng", ex: "Many of my relatives live in another city.", ext: "Nhiều người thân của tôi sống ở thành phố khác." },
      { w: "appointment", pos: "noun", ph: "/əˈpɔɪnt.mənt/", d: "cuộc hẹn", ex: "I have a dentist appointment at 3 PM.", ext: "Tôi có lịch hẹn nha sĩ lúc 3 giờ chiều." },
      { w: "schedule", pos: "noun", ph: "/ˈskedʒ.uːl/", d: "lịch trình", ex: "My schedule is completely full this week.", ext: "Lịch trình của tôi hoàn toàn kín trong tuần này." },
      { w: "priority", pos: "noun", ph: "/praɪˈɔːr.ə.t̬i/", d: "sự ưu tiên", ex: "My first priority is to finish this project.", ext: "Ưu tiên hàng đầu của tôi là hoàn thành dự án này." },
      { w: "decision", pos: "noun", ph: "/dɪˈsɪʒ.ən/", d: "quyết định", ex: "It was a tough decision to make.", ext: "Đó là một quyết định khó khăn." },
      { w: "opportunity", pos: "noun", ph: "/ˌɑː.pɚˈtuː.nə.t̬i/", d: "cơ hội", ex: "Don't miss this great opportunity.", ext: "Đừng bỏ lỡ cơ hội tuyệt vời này." },
      { w: "challenge", pos: "noun", ph: "/ˈtʃæl.ɪndʒ/", d: "thử thách", ex: "She loves taking on new challenges.", ext: "Cô ấy thích đón nhận những thử thách mới." },
      { w: "success", pos: "noun", ph: "/səkˈses/", d: "thành công", ex: "The new product was a big success.", ext: "Sản phẩm mới là một thành công lớn." },
      { w: "failure", pos: "noun", ph: "/ˈfeɪ.ljɚ/", d: "thất bại", ex: "Failure is just a stepping stone to success.", ext: "Thất bại chỉ là bước đệm đến thành công." },
      { w: "experience", pos: "noun", ph: "/ɪkˈspɪr.i.əns/", d: "kinh nghiệm", ex: "He has a lot of experience in marketing.", ext: "Anh ấy có nhiều kinh nghiệm trong tiếp thị." },
      { w: "memory", pos: "noun", ph: "/ˈmem.ɚ.i/", d: "kỷ niệm", ex: "I have fond memories of my childhood.", ext: "Tôi có những kỷ niệm đẹp về tuổi thơ." },
    ]
  },
  {
    name: "💼 Business English",
    description: "Từ vựng chuyên ngành công sở & kinh doanh",
    thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop",
    isPublic: false,
    words: [
      { w: "meeting", pos: "noun", ph: "/ˈmiː.t̬ɪŋ/", d: "cuộc họp", ex: "We have a team meeting at 10 AM.", ext: "Chúng ta có một cuộc họp nhóm lúc 10 giờ sáng." },
      { w: "agenda", pos: "noun", ph: "/əˈdʒen.də/", d: "chương trình nghị sự", ex: "What's on the agenda for today?", ext: "Nội dung chương trình hôm nay là gì?" },
      { w: "deadline", pos: "noun", ph: "/ˈded.laɪn/", d: "hạn chót", ex: "We must meet the Friday deadline.", ext: "Chúng ta phải kịp thời hạn vào thứ Sáu." },
      { w: "project", pos: "noun", ph: "/ˈprɑː.dʒekt/", d: "dự án", ex: "She is managing a new software project.", ext: "Cô ấy đang quản lý một dự án phần mềm mới." },
      { w: "budget", pos: "noun", ph: "/ˈbʌdʒ.ɪt/", d: "ngân sách", ex: "The marketing budget has been cut.", ext: "Ngân sách tiếp thị đã bị cắt giảm." },
      { w: "contract", pos: "noun", ph: "/ˈkɑːn.trækt/", d: "hợp đồng", ex: "Please sign the contract by tomorrow.", ext: "Vui lòng ký hợp đồng vào ngày mai." },
      { w: "client", pos: "noun", ph: "/ˈklaɪ.ənt/", d: "khách hàng", ex: "We have a meeting with a new client.", ext: "Chúng tôi có một cuộc họp với khách hàng mới." },
      { w: "presentation", pos: "noun", ph: "/ˌprez.ənˈteɪ.ʃən/", d: "bài thuyết trình", ex: "His presentation was very impressive.", ext: "Bài thuyết trình của anh ấy rất ấn tượng." },
      { w: "strategy", pos: "noun", ph: "/ˈstræt̬.ə.dʒi/", d: "chiến lược", ex: "We need to rethink our marketing strategy.", ext: "Chúng ta cần xem xét lại chiến lược tiếp thị của mình." },
      { w: "profit", pos: "noun", ph: "/ˈprɑː.fɪt/", d: "lợi nhuận", ex: "The company made a huge profit this year.", ext: "Công ty đã tạo ra lợi nhuận khổng lồ trong năm nay." },
      { w: "loss", pos: "noun", ph: "/lɑːs/", d: "thua lỗ", ex: "The business suffered a significant loss.", ext: "Doanh nghiệp đã phải chịu một khoản lỗ đáng kể." },
      { w: "revenue", pos: "noun", ph: "/ˈrev.ə.nuː/", d: "doanh thu", ex: "Our total revenue increased by 20%.", ext: "Tổng doanh thu của chúng tôi đã tăng 20%." },
      { w: "market", pos: "noun", ph: "/ˈmɑːr.kɪt/", d: "thị trường", ex: "They are targeting the global market.", ext: "Họ đang nhắm đến thị trường toàn cầu." },
      { w: "report", pos: "noun", ph: "/rɪˈpɔːrt/", d: "báo cáo", ex: "I need the financial report by Friday.", ext: "Tôi cần báo cáo tài chính vào thứ Sáu." },
      { w: "feedback", pos: "noun", ph: "/ˈfiːd.bæk/", d: "phản hồi", ex: "Customer feedback is very important to us.", ext: "Phản hồi của khách hàng rất quan trọng đối với chúng tôi." },
      { w: "hire", pos: "verb", ph: "/haɪr/", d: "tuyển dụng", ex: "We are looking to hire a new developer.", ext: "Chúng tôi đang tìm cách thuê một lập trình viên mới." },
      { w: "fire", pos: "verb", ph: "/faɪr/", d: "sa thải", ex: "He was fired for being late too often.", ext: "Anh ta đã bị sa thải vì đi muộn quá thường xuyên." },
      { w: "promote", pos: "verb", ph: "/prəˈmoʊt/", d: "thăng chức", ex: "She was promoted to team leader.", ext: "Cô ấy đã được thăng chức lên làm trưởng nhóm." },
      { w: "negotiate", pos: "verb", ph: "/nəˈɡoʊ.ʃi.eɪt/", d: "đàm phán", ex: "We managed to negotiate a better deal.", ext: "Chúng tôi đã xoay sở để đàm phán một thỏa thuận tốt hơn." },
      { w: "invest", pos: "verb", ph: "/ɪnˈvest/", d: "đầu tư", ex: "They plan to invest heavily in technology.", ext: "Họ dự định đầu tư mạnh vào công nghệ." },
      { w: "analysis", pos: "noun", ph: "/əˈnæl.ə.sɪs/", d: "phân tích", ex: "The data analysis took several weeks.", ext: "Việc phân tích dữ liệu mất vài tuần." },
      { w: "asset", pos: "noun", ph: "/ˈæs.et/", d: "tài sản", ex: "Knowledge is our greatest asset.", ext: "Kiến thức là tài sản lớn nhất của chúng ta." },
      { w: "liability", pos: "noun", ph: "/ˌlaɪ.əˈbɪl.ə.t̬i/", d: "trách nhiệm pháp lý", ex: "The company has significant financial liabilities.", ext: "Công ty có những khoản nợ tài chính đáng kể." },
      { w: "shareholder", pos: "noun", ph: "/ˈʃerˌhoʊl.dɚ/", d: "cổ đông", ex: "The shareholders approved the merger.", ext: "Các cổ đông đã chấp thuận việc sáp nhập." },
      { w: "board", pos: "noun", ph: "/bɔːrd/", d: "lên tàu/máy bay", ex: "The board of directors meets monthly.", ext: "Hội đồng quản trị họp hàng tháng." },
      { w: "equity", pos: "noun", ph: "/ˈek.wə.t̬i/", d: "vốn cổ phần", ex: "He owns a lot of equity in the firm.", ext: "Anh ta sở hữu rất nhiều vốn cổ phần trong công ty." },
      { w: "quarter", pos: "noun", ph: "/ˈkwɔːr.t̬ɚ/", d: "quý (3 tháng)", ex: "Sales rose in the third quarter.", ext: "Doanh số đã tăng trong quý ba." },
      { w: "trend", pos: "noun", ph: "/trend/", d: "xu hướng", ex: "We need to follow the latest market trends.", ext: "Chúng ta cần theo dõi những xu hướng thị trường mới nhất." },
      { w: "growth", pos: "noun", ph: "/ɡroʊθ/", d: "sự tăng trưởng", ex: "The company has seen rapid growth.", ext: "Công ty đã chứng kiến sự tăng trưởng nhanh chóng." },
      { w: "launch", pos: "verb", ph: "/lɑːntʃ/", d: "ra mắt", ex: "We will launch the new app next week.", ext: "Chúng tôi sẽ ra mắt ứng dụng mới vào tuần tới." },
    ]
  },
  {
    name: "✈️ Travel & Places",
    description: "Từ vựng khi đi du lịch và khám phá",
    thumbnailUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop",
    isPublic: false,
    words: [
      { w: "airport", pos: "noun", ph: "/ˈer.pɔːrt/", d: "sân bay", ex: "We arrived at the airport two hours early.", ext: "Chúng tôi đã đến sân bay sớm hai tiếng." },
      { w: "flight", pos: "noun", ph: "/flaɪt/", d: "chuyến bay", ex: "My flight was delayed due to bad weather.", ext: "Chuyến bay của tôi bị hoãn do thời tiết xấu." },
      { w: "ticket", pos: "noun", ph: "/ˈtɪk.ɪt/", d: "vé", ex: "Don't forget your plane ticket.", ext: "Đừng quên vé máy bay của bạn." },
      { w: "passport", pos: "noun", ph: "/ˈpæs.pɔːrt/", d: "hộ chiếu", ex: "You need a valid passport to travel abroad.", ext: "Bạn cần hộ chiếu hợp lệ để đi du lịch nước ngoài." },
      { w: "visa", pos: "noun", ph: "/ˈviː.zə/", d: "thị thực", ex: "I have to apply for a tourist visa.", ext: "Tôi phải xin visa du lịch." },
      { w: "luggage", pos: "noun", ph: "/ˈlʌɡ.ɪdʒ/", d: "hành lý", ex: "My luggage was lost at the airport.", ext: "Hành lý của tôi đã bị thất lạc ở sân bay." },
      { w: "hotel", pos: "noun", ph: "/hoʊˈtel/", d: "khách sạn", ex: "We stayed at a luxury hotel near the beach.", ext: "Chúng tôi đã ở một khách sạn sang trọng gần bãi biển." },
      { w: "reservation", pos: "noun", ph: "/ˌrez.ɚˈveɪ.ʃən/", d: "đặt phòng", ex: "I have a dinner reservation for two.", ext: "Tôi có đặt chỗ ăn tối cho hai người." },
      { w: "tourist", pos: "noun", ph: "/ˈtʊr.ɪst/", d: "khách du lịch", ex: "The city is full of tourists in the summer.", ext: "Thành phố tràn ngập khách du lịch vào mùa hè." },
      { w: "guide", pos: "noun", ph: "/ɡaɪd/", d: "hướng dẫn viên", ex: "Our tour guide was very knowledgeable.", ext: "Hướng dẫn viên du lịch của chúng tôi rất am hiểu." },
      { w: "map", pos: "noun", ph: "/mæp/", d: "bản đồ", ex: "Let's look at the map to find our way.", ext: "Hãy nhìn vào bản đồ để tìm đường đi." },
      { w: "destination", pos: "noun", ph: "/ˌdes.təˈneɪ.ʃən/", d: "điểm đến", ex: "Paris is a popular tourist destination.", ext: "Paris là một điểm đến du lịch nổi tiếng." },
      { w: "souvenir", pos: "noun", ph: "/ˌsuː.vəˈnɪr/", d: "quà lưu niệm", ex: "I bought this mug as a souvenir from London.", ext: "Tôi đã mua chiếc cốc này làm quà lưu niệm từ London." },
      { w: "monument", pos: "noun", ph: "/ˈmɑːn.jə.mənt/", d: "đài kỷ niệm", ex: "The Washington Monument is very tall.", ext: "Đài tưởng niệm Washington rất cao." },
      { w: "museum", pos: "noun", ph: "/mjuːˈziː.əm/", d: "bảo tàng", ex: "We spent the whole afternoon at the art museum.", ext: "Chúng tôi đã dành cả buổi chiều ở bảo tàng nghệ thuật." },
      { w: "restaurant", pos: "noun", ph: "/ˈres.tə.rɑːnt/", d: "nhà hàng", ex: "This is the best Italian restaurant in town.", ext: "Đây là nhà hàng Ý ngon nhất trong thị trấn." },
      { w: "menu", pos: "noun", ph: "/ˈmen.juː/", d: "thực đơn", ex: "Can I see the menu, please?", ext: "Cho tôi xem thực đơn được không?" },
      { w: "tip", pos: "noun", ph: "/tɪp/", d: "tiền boa", ex: "Don't forget to leave a tip for the waiter.", ext: "Đừng quên để lại tiền boa cho người phục vụ." },
      { w: "taxi", pos: "noun", ph: "/ˈtæk.si/", d: "xe taxi", ex: "We took a taxi from the airport to the hotel.", ext: "Chúng tôi đã đi taxi từ sân bay về khách sạn." },
      { w: "subway", pos: "noun", ph: "/ˈsʌb.weɪ/", d: "tàu điện ngầm", ex: "The subway is the fastest way to get around New York.", ext: "Tàu điện ngầm là cách nhanh nhất để đi lại ở New York." },
      { w: "train", pos: "noun", ph: "/treɪn/", d: "xe lửa", ex: "I prefer traveling by train than by bus.", ext: "Tôi thích đi du lịch bằng xe lửa hơn là bằng xe buýt." },
      { w: "bus", pos: "noun", ph: "/bʌs/", d: "xe buýt", ex: "The next bus arrives in ten minutes.", ext: "Chuyến xe buýt tiếp theo sẽ đến trong mười phút nữa." },
      { w: "station", pos: "noun", ph: "/ˈsteɪ.ʃən/", d: "nhà ga", ex: "I'll meet you at the train station.", ext: "Tôi sẽ gặp bạn ở ga xe lửa." },
      { w: "delayed", pos: "adjective", ph: "/dɪˈleɪd/", d: "bị hoãn", ex: "The flight has been delayed by two hours.", ext: "Chuyến bay đã bị hoãn hai giờ." },
      { w: "board", pos: "verb", ph: "/bɔːrd/", d: "lên tàu/máy bay", ex: "Passengers are now ready to board the plane.", ext: "Hành khách hiện đã sẵn sàng lên máy bay." },
      { w: "depart", pos: "verb", ph: "/dɪˈpɑːrt/", d: "khởi hành", ex: "The train departs at 6 AM.", ext: "Xe lửa khởi hành lúc 6 giờ sáng." },
      { w: "arrive", pos: "verb", ph: "/əˈraɪv/", d: "đến nơi", ex: "We will arrive in Tokyo tomorrow.", ext: "Chúng tôi sẽ đến Tokyo vào ngày mai." },
      { w: "explore", pos: "verb", ph: "/ɪkˈsplɔːr/", d: "khám phá", ex: "We spent the day exploring the old city.", ext: "Chúng tôi đã dành cả ngày để khám phá khu phố cổ." },
      { w: "sightseeing", pos: "noun", ph: "/ˈsaɪtˌsiː.ɪŋ/", d: "tham quan ngắm cảnh", ex: "We did some sightseeing in Paris.", ext: "Chúng tôi đã đi ngắm cảnh ở Paris." },
      { w: "customs", pos: "noun", ph: "/ˈkʌs.təmz/", d: "hải quan", ex: "It took a long time to get through customs.", ext: "Phải mất một thời gian dài để qua hải quan." }
    ]
  }
];

async function seedUserTopics(userId) {
  try {
    for (const topicData of SEED_DATA) {
      const topic = await Topic.create({
        userId,
        name: topicData.name,
        description: topicData.description,
        thumbnailUrl: topicData.thumbnailUrl,
        isPublic: topicData.isPublic,
      });

      const cardsData = topicData.words.map((w) => ({
        topicId: topic.id,
        word: w.w,
        phonetic: w.ph,
        partOfSpeech: w.pos,
        definition: w.d,
        exampleSentence: w.ex,
        exampleTranslation: w.ext,
        imageUrl: DEFAULT_IMAGE,
      }));

      // Insert all cards in bulk
      await Flashcard.bulkCreate(cardsData);
    }
    console.log(`[Seed] Created ${SEED_DATA.length} topics for user ${userId}`);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed topics for user ${userId}:`, error);
  }
}

module.exports = {
  seedUserTopics,
};
