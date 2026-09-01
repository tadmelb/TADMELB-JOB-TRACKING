import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-101',
    projectNumber: 'PRJ-101',
    title: 'Hàng Rào Colorbond & Plinth Bê Tông Chống Đất',
    status: 'urgent',
    priority: 'urgent',
    clientName: 'Daniel Roberts',
    clientPhone: '0412 889 231',
    clientEmail: 'daniel.roberts@gmail.com',
    siteAddress: '14 Kingston Road',
    suburb: 'Glen Waverley VIC 3150',
    accessNotes: 'Lối hông nhà mở sẵn. Đã liên hệ hàng xóm số 16 đồng ý thi công.',
    sections: [
      {
        id: 'sec-101-1',
        title: 'Hàng rào hông trái (Boundary Fence)',
        dimensions: '38m dài x 1.8m cao',
        materials: '16 tấm panel Colorbond Monument, 17 trụ thép 65x65x2.4m, 32 thanh plinth bê tông 50mm, 20 bao bê tông rapid-set',
        specifications: 'Đào hố trụ sâu 600mm, đổ bê tông rapid-set, gắn 2 tầng plinth chống đất bên dưới chân tôn.',
        notes: 'Canh dây thẳng tuyệt đối, không để khe hở dưới chân plinth.'
      },
      {
        id: 'sec-101-2',
        title: 'Cổng đi bộ hông nhà (Side Access Gate)',
        dimensions: '900mm rộng x 1800mm cao',
        materials: 'Khung thép mạ kẽm sơn tĩnh điện Monument, bản lề tự đóng D&D, khóa chốt MagnaLatch',
        specifications: 'Hàn khung chắc chắn, bắt chốt an toàn chống va đập gió mạnh.',
        notes: 'Chỉnh độ mở mượt mà, chìa khóa dự phòng trao khách khi bàn giao.'
      }
    ],
    colour: 'Colorbond Monument',
    colourHex: '#33373B',
    dimensions: '38m dài x 1.8m cao | Cổng 900x1800mm',
    style: 'Colorbond Boundary Fence + Side Gate',
    materialsSummary: 'Colorbond Panels, Trụ 65x65, Concrete Plinths, Khóa D&D MagnaLatch',
    siteInstructions: '🚨 CÔNG VIỆC KHẨN CẤP: Chú ý đào cẩn thận vì có đường ống nước cạnh tường rào. Khách yêu cầu xong trước thứ 6.',
    createdAt: '2026-08-08',
    scheduledStartDate: '2026-08-14',
    targetCompletionDate: '2026-08-16',
    progressPercentage: 45,
    workflowTasks: [
      { id: 't1', label: 'Khảo sát hiện trường & Đo đạc kích thước thực tế', completed: true, completedAt: '2026-08-09' },
      { id: 't2', label: 'Kiểm tra đường điện ngầm / ống nước (Dial Before You Dig)', completed: true, completedAt: '2026-08-10' },
      { id: 't3', label: 'Đặt hàng & Vận chuyển vật tư, phụ kiện tới công trình', completed: true, completedAt: '2026-08-12' },
      { id: 't4', label: 'Dọn dẹp mặt bằng, tháo dỡ công trình cũ', completed: true, completedAt: '2026-08-13' },
      { id: 't5', label: 'Đào hố móng / Khoan cọc & Đổ bê tông trụ chịu lực', completed: true, completedAt: '2026-08-14' },
      { id: 't6', label: 'Lắp ráp khung xương chính (dầm, đà, thanh giằng)', completed: false },
      { id: 't7', label: 'Lắp đặt tấm ốp, ván sàn, tôn lợp & phụ kiện khóa/cổng', completed: false },
      { id: 't8', label: 'Xử lý hoàn thiện: Sơn/Quét dầu, bắn silicone', completed: false },
      { id: 't9', label: 'Dọn dẹp công trường & Bàn giao nghiệm thu', completed: false }
    ],
    siteLogs: [
      {
        id: 'l1',
        date: '2026-08-14',
        author: 'Supervisor',
        note: 'Đã hoàn thành tháo dỡ hàng rào cũ, đào xong 17 hố trụ và đổ bê tông cố định. Mai bắt đầu ráp panel.',
        weather: 'Nắng nhẹ, gió êm'
      }
    ],
    notes: 'Khách hàng dặn kỹ không để trầy xước tôn khi di chuyển vật tư qua vườn hoa.'
  },
  {
    id: 'prj-102',
    projectNumber: 'PRJ-102',
    title: 'Sàn Gỗ Merbau Ngoài Trời & Mái Che Pergola Alfresco',
    status: 'in_progress',
    priority: 'high',
    clientName: 'Sarah Jenkins',
    clientPhone: '0433 712 904',
    clientEmail: 'sarah.j@outlook.com',
    siteAddress: '27 Canterbury Road',
    suburb: 'Camberwell VIC 3124',
    accessNotes: 'Lối sau nhà qua garage, có chìa khóa hộp lockbox mã 4421.',
    sections: [
      {
        id: 'sec-102-1',
        title: 'Sàn gỗ Merbau Alfresco (Hardwood Decking)',
        dimensions: '7.2m x 4.5m (32.4m²)',
        materials: 'Ván sàn Merbau 90x19mm vát cạnh đã ngâm dầu, đà gỗ thông xử lý F7 H3 140x45, vít inox 316',
        specifications: 'Đà phụ cách nhau 400mm, dán joist protector tape chống mục, khe hở ván 4.5mm đều tăm tắp, bo viền picture framing kép.',
        notes: 'Quét thêm 1 lớp dầu Merbau bảo dưỡng sau khi bắn vít hoàn thiện.'
      },
      {
        id: 'sec-102-2',
        title: 'Mái che Pergola vát Skillion (Timber Pergola)',
        dimensions: '6.0m x 4.5m',
        materials: 'Cột gỗ Cypress 115x115, xà gồ 190x45, tấm lợp Polycarbonate Laserlite 3000 Grey Tint',
        specifications: 'Khoan pad Extenda chịu lực gắn trực tiếp vào xà nhà, gắn máng xối Colorbond nối vào ống thoát nước.',
        notes: 'Đảm bảo độ dốc thoát nước tối thiểu 5 độ.'
      }
    ],
    colour: 'Natural Merbau Oil + Woodland Grey Trim',
    colourHex: '#8B3E2F',
    dimensions: '32.4m² Sàn + 27m² Pergola',
    style: 'Hardwood Deck + Laserlite Skillion Pergola',
    materialsSummary: 'Merbau Decking 90x19, F7 Treated Pine Joists, Cypress Posts 115x115, Laserlite 3000',
    siteInstructions: 'Bắn vít inox thẳng hàng theo dây laser. Kiểm tra kỹ độ dốc máng xối pergola.',
    createdAt: '2026-08-04',
    scheduledStartDate: '2026-08-11',
    targetCompletionDate: '2026-08-18',
    progressPercentage: 65,
    workflowTasks: [
      { id: 't1', label: 'Khảo sát hiện trường & Đo đạc kích thước thực tế', completed: true, completedAt: '2026-08-05' },
      { id: 't2', label: 'Kiểm tra đường điện ngầm / ống nước', completed: true, completedAt: '2026-08-06' },
      { id: 't3', label: 'Đặt hàng & Vận chuyển vật tư tới công trình', completed: true, completedAt: '2026-08-08' },
      { id: 't4', label: 'Dọn dẹp mặt bằng, cán phẳng đất', completed: true, completedAt: '2026-08-11' },
      { id: 't5', label: 'Đào hố móng & Đổ bê tông trụ cột chịu lực', completed: true, completedAt: '2026-08-12' },
      { id: 't6', label: 'Lắp ráp khung xương đà dầm sàn & cột pergola', completed: true, completedAt: '2026-08-13' },
      { id: 't7', label: 'Lắp đặt ván sàn Merbau & lợp tấm Polycarbonate', completed: false },
      { id: 't8', label: 'Xử lý hoàn thiện: Quét dầu Merbau lớp 2, lắp máng xối', completed: false },
      { id: 't9', label: 'Dọn dẹp công trường & Bàn giao', completed: false }
    ],
    siteLogs: [
      {
        id: 'l102-1',
        date: '2026-08-13',
        author: 'Lead Builder',
        note: 'Đã hoàn thành toàn bộ khung đà dầm sàn và dựng xong 4 cột Cypress pergola. Đang tiến hành lợp mái.',
        weather: 'Trời nắng ráo đẹp'
      }
    ],
    notes: 'Chủ nhà yêu cầu chừa 2 hộp nắp âm sàn để luồn dây đèn LED sau này.'
  },
  {
    id: 'prj-103',
    projectNumber: 'PRJ-103',
    title: 'Gói Combo: Hàng Rào Hông + Nhà Để Xe Đôi (Double Carport)',
    status: 'confirmed',
    priority: 'medium',
    clientName: 'Michael & Jenny Wong',
    clientPhone: '0421 990 114',
    clientEmail: 'wong.family@yahoo.com.au',
    siteAddress: '88 Highfield Road',
    suburb: 'Box Hill VIC 3128',
    accessNotes: 'Đường xe chạy rộng rãi, có chỗ đậu xe tải vật tư ngay trước cổng.',
    sections: [
      {
        id: 'sec-103-1',
        title: 'Nhà để xe đôi (Double Carport)',
        dimensions: '6.0m x 5.8m (34.8m²)',
        materials: 'Trụ thép hộp 90x90 mạ kẽm sơn tĩnh điện Surfmist, dầm C-Purlin thép mạ, tôn sóng Colorbond Surfmist',
        specifications: 'Đổ móng bê tông cọc sâu 800mm, liên kết bulong cường độ cao chịu bão.',
        notes: 'Canh chỉnh thẳng hàng với mái hiên nhà chính.'
      },
      {
        id: 'sec-103-2',
        title: 'Hàng rào mặt tiền (Front Decorative Slat Fence)',
        dimensions: '18m dài x 1.5m cao',
        materials: 'Nan nhôm hộp sơn tĩnh điện Surfmist, trụ 75x75, chốt khóa tự động',
        specifications: 'Khoảng cách nan 20mm tạo độ thoáng và thẩm mỹ.',
        notes: 'Chừa khe gắn hộp thư bưu điện theo yêu cầu chủ nhà.'
      }
    ],
    colour: 'Colorbond Surfmist',
    colourHex: '#E5E8E5',
    dimensions: 'Carport 6x5.8m + Hàng rào 18m',
    style: 'Double Steel Carport + Front Slat Fence',
    materialsSummary: 'Trụ 90x90, C-Purlins, Tôn Surfmist, Nan nhôm sơn tĩnh điện',
    siteInstructions: 'Vật tư giao vào thứ Hai 17/08. Thi công móng carport trước, rào làm sau.',
    createdAt: '2026-08-10',
    scheduledStartDate: '2026-08-17',
    targetCompletionDate: '2026-08-22',
    progressPercentage: 20,
    workflowTasks: [
      { id: 't1', label: 'Khảo sát hiện trường & Đo đạc kích thước thực tế', completed: true, completedAt: '2026-08-10' },
      { id: 't2', label: 'Kiểm tra đường điện ngầm / ống nước', completed: true, completedAt: '2026-08-11' },
      { id: 't3', label: 'Đặt hàng & Vận chuyển vật tư tới công trình', completed: false },
      { id: 't4', label: 'Dọn dẹp mặt bằng, khoan định vị móng', completed: false },
      { id: 't5', label: 'Đào hố móng & Đổ bê tông trụ cột chịu lực', completed: false },
      { id: 't6', label: 'Lắp ráp khung thép dầm carport & trụ rào', completed: false },
      { id: 't7', label: 'Lợp tôn Colorbond & lắp nan rào nhôm', completed: false },
      { id: 't8', label: 'Xử lý hoàn thiện: Bắn silicone, sơn touch-up đầu vít', completed: false },
      { id: 't9', label: 'Dọn dẹp công trường & Bàn giao', completed: false }
    ],
    siteLogs: [
      {
        id: 'l103-1',
        date: '2026-08-11',
        author: 'Project Manager',
        note: 'Đã hoàn tất đo đạc, chốt hợp đồng và lên lịch giao thép vào ngày 17/08.',
        weather: 'Fine'
      }
    ],
    notes: 'Chủ nhà đã xin xong giấy phép xây dựng Carport với Council Box Hill.'
  },
  {
    id: 'prj-104',
    projectNumber: 'PRJ-104',
    title: 'Hàng Rào Gỗ Xử Lý Treated Pine & Plinth Ngăn Đất',
    status: 'completed',
    priority: 'low',
    clientName: 'Peter Henderson',
    clientPhone: '0408 123 765',
    clientEmail: 'peter.h@gmail.com',
    siteAddress: '52 Blackburn Road',
    suburb: 'Mount Waverley VIC 3149',
    accessNotes: 'Nhà góc đường (corner block), lối vào thi công rất thuận tiện.',
    sections: [
      {
        id: 'sec-104-1',
        title: 'Hàng rào gỗ thông Treated Pine Paling',
        dimensions: '42m dài x 1.95m cao (đã gồm plinth)',
        materials: 'Ván gỗ thông Treated Pine 150x12 & 100x12 xếp so le (overlap), trụ gỗ Cypress 125x75, đà ngang 75x50 3 tầng, 2 thanh plinth 150x25',
        specifications: 'Đào hố trụ sâu 650mm, đổ bê tông chắc chắn, đinh xoắn mạ kẽm chống rỉ, đóng nắp mũ che đỉnh rào (capping).',
        notes: 'Chỉnh thẳng đều tăm tắp, xử lý góc cua mềm mại theo vỉa hè.'
      }
    ],
    colour: 'Treated Pine Natural (Khách tự sơn sau)',
    colourHex: '#D7B98E',
    dimensions: '42m dài x 1.95m cao',
    style: 'Treated Pine Overlapping Paling Fence with Capping',
    materialsSummary: 'Paling 150x12 & 100x12, Cypress Posts 125x75, Rails 75x50, Plinths 150x25',
    siteInstructions: 'Công trình đã hoàn thành xuất sắc và bàn giao đầy đủ cho khách hàng.',
    createdAt: '2026-08-01',
    scheduledStartDate: '2026-08-06',
    targetCompletionDate: '2026-08-09',
    actualCompletionDate: '2026-08-09',
    progressPercentage: 100,
    workflowTasks: [
      { id: 't1', label: 'Khảo sát hiện trường & Đo đạc kích thước thực tế', completed: true, completedAt: '2026-08-02' },
      { id: 't2', label: 'Kiểm tra đường điện ngầm / ống nước', completed: true, completedAt: '2026-08-03' },
      { id: 't3', label: 'Đặt hàng & Vận chuyển vật tư tới công trình', completed: true, completedAt: '2026-08-05' },
      { id: 't4', label: 'Dọn dẹp mặt bằng, tháo dỡ rào cũ', completed: true, completedAt: '2026-08-06' },
      { id: 't5', label: 'Đào hố móng & Đổ bê tông trụ chịu lực', completed: true, completedAt: '2026-08-07' },
      { id: 't6', label: 'Lắp ráp khung đà ngang 3 tầng', completed: true, completedAt: '2026-08-08' },
      { id: 't7', label: 'Đóng ván gỗ xếp so le & gắn nắp capping', completed: true, completedAt: '2026-08-09' },
      { id: 't8', label: 'Xử lý hoàn thiện & vệ sinh dọn rác', completed: true, completedAt: '2026-08-09' },
      { id: 't9', label: 'Dọn dẹp công trường & Bàn giao', completed: true, completedAt: '2026-08-09' }
    ],
    siteLogs: [
      {
        id: 'l104-1',
        date: '2026-08-09',
        author: 'Lead Supervisor',
        note: 'Công trình đã hoàn thành 100%, chủ nhà ký nghiệm thu hài lòng tuyệt đối.',
        weather: 'Trời trong xanh'
      }
    ],
    notes: 'Chủ nhà khen đội thợ thi công nhanh, sạch sẽ và đúng giờ.'
  }
];
