import { WorkflowTask, WorkSection } from '../types';

export interface ColourPreset {
  name: string;
  hex: string;
  category?: 'colorbond' | 'timber' | 'powdercoat' | 'polycarb';
}

export const COLOUR_PRESETS: ColourPreset[] = [
  // Colorbond popular colours
  { name: 'Colorbond Monument', hex: '#33373B', category: 'colorbond' },
  { name: 'Colorbond Woodland Grey', hex: '#4D5350', category: 'colorbond' },
  { name: 'Colorbond Surfmist', hex: '#E5E8E5', category: 'colorbond' },
  { name: 'Colorbond Night Sky (Black)', hex: '#1C1C1D', category: 'colorbond' },
  { name: 'Colorbond Shale Grey', hex: '#BFC2BE', category: 'colorbond' },
  { name: 'Colorbond Dune', hex: '#AEABA2', category: 'colorbond' },
  { name: 'Colorbond Basalt', hex: '#636569', category: 'colorbond' },
  { name: 'Colorbond Ironstone', hex: '#3A424C', category: 'colorbond' },
  { name: 'Colorbond Paperbark', hex: '#CDC3B0', category: 'colorbond' },
  { name: 'Colorbond Jasper', hex: '#6A5F56', category: 'colorbond' },
  { name: 'Colorbond Deep Ocean', hex: '#263B4D', category: 'colorbond' },
  { name: 'Colorbond Manor Red', hex: '#6B3130', category: 'colorbond' },
  
  // Timber finishes & stains
  { name: 'Natural Merbau Oil (Rich Brown/Red)', hex: '#8B3E2F', category: 'timber' },
  { name: 'Spotted Gum Natural (Honey Amber)', hex: '#B87333', category: 'timber' },
  { name: 'Treated Pine Natural (Light Golden)', hex: '#D7B98E', category: 'timber' },
  { name: 'Jarrah Tone (Deep Dark Red)', hex: '#5A1818', category: 'timber' },
  { name: 'Charcoal / Ebony Stain', hex: '#2A2A2A', category: 'timber' },
  { name: 'Weathered Teak / Silver Ash', hex: '#9E978E', category: 'timber' },
  { name: 'Clear UV Exterior Seal', hex: '#E6D7B9', category: 'timber' },

  // Powdercoat / Structure
  { name: 'Gloss White Powdercoat', hex: '#FFFFFF', category: 'powdercoat' },
  { name: 'Satin Black Powdercoat', hex: '#1E1E1E', category: 'powdercoat' },
  { name: 'Anodised Silver Aluminium', hex: '#C0C0C0', category: 'powdercoat' },
  { name: 'Primed White Timber', hex: '#F5F5F5', category: 'powdercoat' },

  // Polycarbonate / Roof
  { name: 'Clear Polycarbonate', hex: '#E0F2FE', category: 'polycarb' },
  { name: 'Grey Tint Solar Polycarbonate', hex: '#64748B', category: 'polycarb' },
  { name: 'Bronze Heat Stop Polycarbonate', hex: '#78350F', category: 'polycarb' },
  { name: 'Opal / Diffused White', hex: '#F1F5F9', category: 'polycarb' }
];

export const WORK_SECTION_TEMPLATES = [
  {
    title: 'Hàng Rào (Boundary Fence)',
    dimensions: '30m dài x 1.8m cao',
    materials: 'Tấm tôn Colorbond, trụ thép 65x65, plinth bê tông/gỗ thông',
    specifications: 'Đào hố trụ sâu 600mm, đổ bê tông rapid-set, canh dây thẳng tuyệt đối, lắp 2 tấm plinth dưới chân.'
  },
  {
    title: 'Sàn Gỗ Ngoài Trời (Outdoor Deck)',
    dimensions: '6.0m x 4.0m (24m²)',
    materials: 'Gỗ Merbau 90x19mm vát cạnh, đà chịu lực gỗ thông F7 140x45, vít inox 316',
    specifications: 'Khoảng cách đà 400mm, dán băng keo bảo vệ đà, khe hở ván 4mm, quét 2 lớp dầu Merbau chống thấm.'
  },
  {
    title: 'Mái Che Pergola / Mái Hiên',
    dimensions: '5.0m x 3.5m',
    materials: 'Cột gỗ Cypress/thép hộp, xà gồ gỗ thông, tấm lợp Polycarbonate lấy sáng chống nóng',
    specifications: 'Bắt pad Extenda liên kết vào vì kèo nhà, máng xối Colorbond nối vào ống thoát nước mưa.'
  },
  {
    title: 'Nhà Để Xe (Carport)',
    dimensions: '6.0m x 6.0m (2 xe)',
    materials: 'Trụ thép hộp 90x90, dầm thép C-Purlin, tôn lợp sóng Colorbond',
    specifications: 'Đổ móng bê tông 800mm hoặc khoan tắc kê bản mã thép chịu lực gió cao.'
  },
  {
    title: 'Cổng Đi Bộ / Cổng Xe (Gate)',
    dimensions: '900mm x 1800mm',
    materials: 'Khung thép mạ kẽm sơn tĩnh điện, khóa then cài / chốt khóa an toàn',
    specifications: 'Bản lề tự đóng, khóa MagnaLatch / chốt âm đất chắc chắn.'
  },
  {
    title: 'Tường Chắn Đất / Retaining Wall',
    dimensions: '15m dài x 0.6m cao',
    materials: 'Trụ thép chữ H 100UC, tấm đan bê tông cốt thép 200x75',
    specifications: 'Khoan cọc sâu bằng chiều cao tường, lót vải địa kỹ thuật và rải đá thoát nước ag-pipe phía sau.'
  }
];

export const CREW_MEMBERS = [
  'Alex Tran (Lead Builder)',
  'David Nguyen (Supervisor)',
  'Michael Smith (Carpenter)',
  'Tuan Do (Installer)',
  'Chris Evans (Apprentice)',
  'Liam Taylor (Post & Concreting)'
];

export function getDefaultWorkflow(): WorkflowTask[] {
  return [
    { id: 't1', label: 'Khảo sát hiện trường & Đo đạc kích thước thực tế', completed: true, completedAt: '2026-08-10' },
    { id: 't2', label: 'Kiểm tra đường điện ngầm / ống nước (Dial Before You Dig)', completed: false },
    { id: 't3', label: 'Đặt hàng & Vận chuyển vật tư, phụ kiện tới công trình', completed: false },
    { id: 't4', label: 'Dọn dẹp mặt bằng, tháo dỡ công trình cũ (nếu có)', completed: false },
    { id: 't5', label: 'Đào hố móng / Khoan cọc & Đổ bê tông trụ chịu lực', completed: false },
    { id: 't6', label: 'Lắp ráp khung xương chính (dầm, đà, thanh giằng)', completed: false },
    { id: 't7', label: 'Lắp đặt tấm ốp, ván sàn, tôn lợp & phụ kiện khóa/cổng', completed: false },
    { id: 't8', label: 'Xử lý hoàn thiện: Sơn/Quét dầu, bắn silicone, xịt nước chống rò rỉ', completed: false },
    { id: 't9', label: 'Dọn dẹp công trường, quét nam châm nhặt vít thừa & Bàn giao', completed: false }
  ];
}
