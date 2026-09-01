import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, ProjectPriority, WorkSection } from '../types';
import { COLOUR_PRESETS, WORK_SECTION_TEMPLATES, getDefaultWorkflow } from '../data/presets';
import { getCanberraCurrentDateString, formatDate } from '../utils/helpers';
import { 
  X, 
  Plus, 
  Trash2, 
  Layers, 
  Hammer, 
  Calendar, 
  User, 
  Palette
} from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
  initialStatus?: ProjectStatus;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  initialStatus = 'confirmed'
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const [priority, setPriority] = useState<ProjectPriority>('high');

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [accessNotes, setAccessNotes] = useState('');

  // Colour & General Specifications
  const [colour, setColour] = useState('Colorbond Monument');
  const [colourHex, setColourHex] = useState('#33373B');
  const [siteInstructions, setSiteInstructions] = useState('');
  const [notes, setNotes] = useState('');

  // Dates
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [targetCompletionDate, setTargetCompletionDate] = useState('');

  // Multi-part Work Sections (Combo / Multi-part package support!)
  const [sections, setSections] = useState<WorkSection[]>([
    {
      id: 'sec-1',
      title: 'Hạng mục 1: Hàng rào chính (Main Boundary Fence)',
      dimensions: '30m dài x 1.8m cao',
      materials: 'Tôn Colorbond Monument, trụ thép mạ kẽm 65x65, plinth bê tông',
      specifications: 'Đào hố trụ sâu 600mm, đổ bê tông rapid-set, canh dây thẳng tuyệt đối, lắp plinth dưới chân.',
      notes: ''
    }
  ]);

  // Reset form when modal opens with initialStatus
  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus);
      const nextNum = Math.floor(1000 + Math.random() * 9000);
      setTitle(`Trade Project #${nextNum}`);
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  // Add a blank work section
  const handleAddSection = () => {
    const nextIndex = sections.length + 1;
    setSections([
      ...sections,
      {
        id: `sec-${Date.now()}`,
        title: `Hạng mục ${nextIndex}: `,
        dimensions: '',
        materials: '',
        specifications: '',
        notes: ''
      }
    ]);
  };

  // Add section from pre-filled template
  const handleAddFromTemplate = (template: typeof WORK_SECTION_TEMPLATES[0]) => {
    const nextIndex = sections.length + 1;
    setSections([
      ...sections,
      {
        id: `sec-${Date.now()}`,
        title: `Hạng mục ${nextIndex}: ${template.title}`,
        dimensions: template.dimensions,
        materials: template.materials,
        specifications: template.specifications,
        notes: ''
      }
    ]);
  };

  const handleUpdateSection = (index: number, field: keyof WorkSection, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) {
      alert('Công trình cần có ít nhất 1 hạng mục thi công.');
      return;
    }
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !siteAddress.trim()) {
      alert('Vui lòng điền tên khách hàng và địa chỉ công trình.');
      return;
    }

    const newProjectNumber = `PRJ-${Math.floor(1040 + Math.random() * 900)}`;
    const overallDimensions = sections.map(s => s.dimensions).filter(Boolean).join(' | ');

    const newProject: Project = {
      id: `prj-${Date.now()}`,
      projectNumber: newProjectNumber,
      title: title.trim() || `Project ${clientName} - ${suburb || siteAddress}`,
      status,
      priority,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      siteAddress: siteAddress.trim(),
      suburb: suburb.trim() || 'Melbourne VIC',
      accessNotes: accessNotes.trim(),
      sections,
      colour,
      colourHex,
      dimensions: overallDimensions,
      style: sections[0]?.title || 'Standard Trade Build',
      materialsSummary: sections.map(s => s.materials).filter(Boolean).join('; '),
      siteInstructions: siteInstructions.trim(),
      createdAt: getCanberraCurrentDateString(),
      scheduledStartDate: scheduledStartDate || undefined,
      targetCompletionDate: targetCompletionDate || undefined,
      progressPercentage: 0,
      workflowTasks: getDefaultWorkflow(),
      photos: [],
      notes: notes.trim()
    };

    onSaveProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="border-b border-slate-200 bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md">
              <Hammer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">
                Tạo Công Trình Mới (Create Trade Project)
              </h2>
              <p className="text-xs text-slate-300">
                Thêm thông tin khách hàng, quy cách kỹ thuật, gói hạng mục combo và dặn dò thi công
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-900">
          
          {/* 1. Job Title & Status Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Tên Dự Án / Tên Công Trình (Project Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hàng Rào Colorbond & Sàn Gỗ Merbau Alfresco"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Trạng Thái (Status) *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-black cursor-pointer focus:outline-hidden ${
                  status === 'urgent'
                    ? 'border-red-500 bg-red-50 text-red-700 font-black ring-2 ring-red-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:bg-white'
                }`}
              >
                <option value="urgent">Urgent Job (Gấp / Làm Ngay)</option>
                <option value="confirmed">Confirmed (Đã Chốt - Lên Lịch)</option>
                <option value="in_progress">In Progress (Đang Thi Công)</option>
                <option value="completed">Completed (Đã Xong)</option>
                <option value="on_hold">On Hold (Tạm Dừng)</option>
              </select>
            </div>
          </div>

          {/* 2. Client & Site Location */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200/80 pb-2">
              <User className="h-4 w-4 text-amber-600" />
              <span>Thông Tin Khách Hàng & Địa Chỉ Thi Công (Client & Site)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Tên Khách Hàng *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="VD: Anh Tuấn / John Smith"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Số Điện Thoại</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0412 345 678"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Địa Chỉ Nhà / Số Nhà & Đường *</label>
                <input
                  type="text"
                  required
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="VD: 42 Highfield Road"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Khu Vực / Suburb (VIC)</label>
                <input
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="Camberwell VIC 3124"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Lối Vào Hiện Trường & Lưu Ý An Toàn (Site Access)</label>
              <input
                type="text"
                value={accessNotes}
                onChange={(e) => setAccessNotes(e.target.value)}
                placeholder="VD: Lối hông mở sẵn, có ổ điện ngoài sân, chó đã nhốt..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 3. MULTI-PART WORK SECTIONS (COMBO / PACKAGE SUPPORT) */}
          <div className="rounded-2xl border-2 border-amber-300/80 bg-amber-50/30 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                  <Layers className="h-4 w-4 text-amber-600" />
                  <span>Các Hạng Mục Thi Công (Work Scope & Multi-Part Package)</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Bạn có thể tạo nhiều hạng mục trong 1 dự án (Ví dụ: Hàng rào + Sàn gỗ + Mái che + Cổng)
                </p>
              </div>

              {/* Add Section Button */}
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Thêm Hạng Mục</span>
              </button>
            </div>

            {/* Quick Template Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Thêm nhanh mẫu:</span>
              {WORK_SECTION_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddFromTemplate(tmpl)}
                  className="rounded-lg border border-amber-200 bg-white px-2 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                >
                  + {tmpl.title.split('(')[0]}
                </button>
              ))}
            </div>

            {/* Sections List */}
            <div className="space-y-3">
              {sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                      Hạng mục #{index + 1}
                    </span>

                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Xóa hạng mục này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        Tên Hạng Mục (Section Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={section.title}
                        onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                        placeholder="VD: Hàng rào bên hông / Sàn gỗ Decking..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        Kích Thước / Chiều Dài x Cao (Dimensions)
                      </label>
                      <input
                        type="text"
                        value={section.dimensions || ''}
                        onChange={(e) => handleUpdateSection(index, 'dimensions', e.target.value)}
                        placeholder="VD: 36m dài x 1.8m cao (hoặc 6.0m x 4.0m)"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      Vật Tư & Phụ Kiện Cần Dùng (Materials List)
                    </label>
                    <input
                      type="text"
                      value={section.materials || ''}
                      onChange={(e) => handleUpdateSection(index, 'materials', e.target.value)}
                      placeholder="VD: 16 tấm panel Colorbond, 17 trụ thép 65x65, 32 thanh plinth bê tông..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      Quy Cách Kỹ Thuật & Dặn Dò Cho Thợ (Specifications & Worker Instructions)
                    </label>
                    <textarea
                      rows={2}
                      value={section.specifications || ''}
                      onChange={(e) => handleUpdateSection(index, 'specifications', e.target.value)}
                      placeholder="VD: Đào hố trụ sâu 600mm, đổ bê tông rapid-set, gắn 2 tấm plinth dưới chân..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:bg-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Colour & General Specifications */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              <Palette className="h-4 w-4 text-amber-600" />
              <span>Màu Sắc & Hướng Dẫn Kỹ Thuật (Colour & Instructions)</span>
            </div>

            {/* Colour Selector & Preset Swatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-600">
                  Màu Sắc / Bề Mặt Hoàn Thiện (Colour / Finish)
                </label>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: colourHex }}
                  />
                  <span>{colour}</span>
                </div>
              </div>

              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                placeholder="VD: Colorbond Monument, Merbau Oiled, Satin Black..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
              />

              {/* Quick swatch selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {COLOUR_PRESETS.slice(0, 12).map((cp) => (
                  <button
                    key={cp.name}
                    type="button"
                    onClick={() => {
                      setColour(cp.name);
                      setColourHex(cp.hex);
                    }}
                    title={cp.name}
                    className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                      colour === cp.name
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: cp.hex }}
                    />
                    <span>{cp.name.replace('Colorbond ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Instructions for Builders/Workers */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">
                📝 Hướng Dẫn & Dặn Dò Cho Hiện Trường (Site Instructions)
              </label>
              <textarea
                rows={3}
                value={siteInstructions}
                onChange={(e) => setSiteInstructions(e.target.value)}
                placeholder="VD: Chú ý đào cẩn thận vì có đường ống nước cạnh tường rào. Khách yêu cầu xong trước thứ 6..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 5. Schedule Dates */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span>Tiến Độ Lên Lịch (Project Schedule)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600">Ngày Bắt Đầu Thi Công</label>
                  {scheduledStartDate && (
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {formatDate(scheduledStartDate)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={scheduledStartDate}
                  onChange={(e) => setScheduledStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600">Ngày Dự Kiến Hoàn Thành</label>
                  {targetCompletionDate && (
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {formatDate(targetCompletionDate)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Định dạng ngày tiêu chuẩn Australia: Ngày/Tháng/Năm (DD/MM/YYYY) - Múi giờ Canberra.
            </p>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ (Cancel)
            </button>

            <button
              type="submit"
              className="rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
            >
              + Lưu & Tạo Công Trình (Create Project)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
