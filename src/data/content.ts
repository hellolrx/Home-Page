export const email = 'liangrx0501@gmail.com'
export const githubUrl = 'https://github.com/hellolrx'

export const chapters = [
  { id: 'top', label: 'Origin' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'focus', label: 'Focus' },
  { id: 'missions', label: 'Missions' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Channel' },
]

export const navLinks = [
  { label: 'Foundation', href: '#foundation' },
  { label: 'Focus', href: '#focus' },
  { label: 'Missions', href: '#missions' },
]

export const foundation = {
  school: 'City University of Macau',
  schoolZh: '澳門城市大學',
  degree: 'Master of Computer Science',
  award: '霍英東獎基金會獎學金',
  honors: [
    '系统集成项目管理工程师 · 软考中级',
    '2022 东方财富全国金融挑战赛 · 省赛一等奖',
    'CET-6',
  ],
  stats: [
    { value: 3.96, decimals: 2, suffix: '', label: 'GPA / 4.0' },
    { value: 1, decimals: 0, suffix: ' / 58', label: 'ACADEMIC RANK' },
  ],
}

export const manifesto = {
  line: 'Research gave me the instinct to verify.',
  accentFrom: 4,
  note: '科研训练留下的习惯是：先验证，再下结论。现在，我把这种严谨带进大模型应用与语音系统的生产环境。',
}

export const layers = [
  {
    id: '01',
    title: 'Model',
    eyebrow: 'MODEL · BACKBONE',
    desc: '按任务选型的多模态模型底座：大模型负责理解与生成，向量与重排负责检索，ASR、TTS、声纹、OCR 负责感知。',
    tags: ['Qwen3-32B-AWQ', 'Qwen3-Embedding-8B', 'Qwen3-Reranker-8B', 'GLM-OCR', 'FunASR Nano', 'CosyVoice2', 'CAM++'],
    accent: '#67d6ff',
  },
  {
    id: '02',
    title: 'Algorithm',
    eyebrow: 'ALGORITHM · WORKFLOW',
    desc: '把模型编排成可运行的算法链路：意图路由、层级检索、向量召回与精排、结构化抽取、模板化文档生成。',
    tags: ['RAG / Agent', 'Intent Routing', 'Vector Retrieval', 'Rerank', 'Structured Extraction'],
    accent: '#ffac77',
  },
  {
    id: '03',
    title: 'Deployment',
    eyebrow: 'GPU · SERVICE',
    desc: '让模型稳定在线：vLLM 与 MindIE 双推理后端，GPUStack 统一管理模型起停，固定端口供多系统复用算力。',
    tags: ['vLLM', 'MindIE', 'GPUStack', 'FastAPI / WebSocket', 'Docker'],
    accent: '#a58bff',
  },
]

export const missionsIntro = '四个落地项目，我负责其中的算法链路（Python）：大模型理解与抽取、检索与精排、语音感知、推理服务接入。'

export const missions = [
  {
    index: 'M-01',
    title: 'Hospital Physical Examination',
    subtitle: '医院实时语音体检信息抽取系统',
    accent: '#ffac77',
    summary: '医生边检查边口述，系统实时把语音整理成 12 区块的结构化体检表。',
    role: '算法侧 · Python',
    stack: ['FunASR Nano', 'CAM++', 'Qwen3-32B-AWQ', 'Qwen3-Embedding-8B', 'Qwen3-Reranker-8B', 'MindIE', 'FastAPI'],
    steps: [
      { label: '语音感知', text: 'VAD 切分后由 FunASR Nano 流式识别并恢复标点，CAM++ 声纹区分说话人，转写结果带发言归属。' },
      { label: '语义抽取', text: 'Qwen3-Embedding-8B 向量召回、Qwen3-Reranker-8B 精排收敛上下文，再由 Qwen3-32B-AWQ 完成结构化抽取，填充 12 区块体检表。' },
      { label: '推理服务', text: 'MindIE 承载模型推理，FastAPI WebSocket 全程流式接入。' },
    ],
  },
  {
    index: 'M-02',
    title: 'CNOOC Voice Control',
    subtitle: '中海油语音调度与 ASR 服务',
    accent: '#67a8ff',
    summary: '一句口令，从唤醒、转写到意图解析，直接调度到对应的摄像头与云台。',
    role: '算法侧 · Python',
    stack: ['FunASR Nano', 'sherpa-onnx KWS', 'Qwen3-32B-AWQ', 'vLLM', 'FastAPI', 'WebSocket'],
    steps: [
      { label: '唤醒转写', text: 'sherpa-onnx KWS 在 CPU 上常开唤醒，FunASR Nano 流式转写；热词与摄像头一一对应，针对点位名称做识别增强。' },
      { label: '意图检索', text: 'Qwen3-32B-AWQ 做意图路由，层级检索缩小候选，LLM 精排定位目标；支持多轮指代，连续调度摄像头与云台。' },
      { label: '推理服务', text: 'vLLM 部署大模型，FastAPI SSE 流式下发指令，WebSocket 接入。' },
    ],
  },
  {
    index: 'M-03',
    title: 'MeetScribe',
    subtitle: '会议语音智能系统',
    accent: '#67d6ff',
    summary: '把音频、转写、向量、LLM 与 OCR 组织成一个可扩展的会议工作空间。',
    role: '算法侧 · Python',
    stack: ['FunASR Nano', 'CAM++', 'Qwen3-32B-AWQ', 'bge-m3', 'GLM-OCR', 'vLLM', 'GPUStack'],
    steps: [
      { label: '转写声纹', text: 'FunASR Nano 实时转写，CAM++ 声纹区分说话人，输出带发言人的会议记录。' },
      { label: '知识生成', text: 'bge-m3 向量检索会议知识；Qwen3-32B-AWQ 与 GLM-OCR 生成纪要、待办与文档问答，模板设计器支持自定义纪要模板。' },
      { label: '算力编排', text: '运行在 GB10 统一显存服务器，GPUStack 统一管理 LLM / Embedding / OCR 模型起停，固定端口供多系统复用算力。' },
    ],
  },
  {
    index: 'M-04',
    title: 'Traffic AI Callback',
    subtitle: '交通回访 AI 外呼与问答系统',
    accent: '#a58bff',
    summary: 'AI 电话回访：听懂来电、检索答案、语音回读，在一通电话内闭环。',
    role: '算法侧 · Python',
    stack: ['FunASR Nano', 'CosyVoice2', 'Qwen3-32B-AWQ', 'bge-base-zh-v1.5', 'FAISS', 'FastAPI'],
    steps: [
      { label: '语音双工', text: 'FunASR Nano 实时转写，CosyVoice2 语音回读，经 Aicall 支持外呼 / 呼入双向通话。' },
      { label: '分级应答', text: 'bge-base-zh-v1.5 + FAISS 向量检索问答库：命中直接返回答案，需润色的交给 LLM，未命中回落原流程。' },
      { label: '检索服务', text: 'QA 向量服务独立部署，MySQL 同步问答库，按场景分索引，固定阈值取最优一条。' },
    ],
  },
]

export const toolRows = [
  { label: 'WORK TOOLS', items: ['Python', 'Docker', 'vLLM', 'FastAPI', 'Vue', 'MySQL', 'Git'] },
  { label: 'SELF-BUILT', items: ['Cloudflare', 'Supabase', 'CLI Proxy API', 'NewAPI', 'Tailscale', 'VPS', 'Xray'] },
]

export const aiWorkflow = [
  { stage: 'RESEARCH', tools: 'Gemini', text: '方案调研' },
  { stage: 'CODING', tools: 'Codex · Claude', text: '编码实现' },
  { stage: 'AUTOMATION', tools: 'Muse', text: '自动化操作' },
]

export const openSource = {
  repo: 'modelscope/FunASR',
  pull: '#3240',
  status: 'Merged',
  title: 'fix: disable duplicate dynamic silence logic in DynamicStreamingVAD',
  note: '修复流式 VAD 中模型层动态静音逻辑重复生效、逐帧覆盖调用方阈值的问题，已合并进 FunASR 主干。',
  url: 'https://github.com/modelscope/FunASR/pull/3240',
}
