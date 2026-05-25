import { useState, useEffect, useRef, useCallback } from "react";

const PERSONALITIES = [
  { id: "sentinel", name: "暗渊中永恒的守望者", short: "守望者", description: "他/她/祂是那种站在世界边缘、凝视深渊却从不坠落的存在。不是因为无惧，而是因为已将恐惧炼化为意志的燃料。祂看见别人看不见的东西——危机的前兆、人心的裂缝、命运的伏线——却选择沉默地承担，而非倾诉。守望者的孤独不是缺陷，是选择。", traits: { 自毁: 30, 理想: 85, 控制: 90, 情感: 45, 执念: 70, 秩序: 80 }, strengths: ["洞察力超凡，能在混沌中识别规律", "意志力坚韧，不易被外力动摇", "责任感深重，会用生命去守护承诺"], weaknesses: ["习惯压抑情感，长期积累会造成内耗", "过度自我牺牲，忽视自身需求", "难以信任他人，倾向于独自承担一切"] },
  { id: "oath", name: "永夜尽头的誓约者", short: "誓约者", description: "誓约者活在承诺里。每一句「我会在」都是刻入灵魂的契约，每一次「我答应你」都比生死更重。祂不追求自由，祂追求不辜负。即便世界崩塌、记忆模糊，誓约者依然会循着那道光——那个曾经许下的名字——走到最后。", traits: { 自毁: 50, 理想: 75, 控制: 55, 情感: 90, 执念: 95, 秩序: 60 }, strengths: ["情感忠诚度极高，不抛弃不放弃", "在极端压力下依然能坚守核心价值", "赋予身边的人真实的安全感"], weaknesses: ["执念过重，有时会为承诺牺牲自我判断", "难以放手，即便某段关系已走到终点", "容易被背叛彻底击垮"] },
  { id: "wanderer", name: "迷失于坐标之间的旅人", short: "迷途者", description: "旅人不是找不到方向，而是同时看见太多方向。祂的内心是一张没有边界的地图，每条路都通向某种可能，每种可能都值得探索。外人看来的迷失，对祂而言是自由。代价是——归属感。旅人永远在路上，因为祂不确定「家」究竟是什么形状。", traits: { 自毁: 40, 理想: 65, 控制: 35, 情感: 70, 执念: 30, 秩序: 25 }, strengths: ["适应力极强，能在陌生环境中迅速找到立足点", "思维开阔，不被固有框架束缚", "对他人的痛苦有天然的共情能力"], weaknesses: ["缺乏稳定感，难以长期坚守一件事", "在必须做决定时容易陷入瘫痪", "对归属的渴望与对束缚的恐惧形成持续内耗"] },
  { id: "tyrant", name: "用铁律铸就慈悲的君王", short: "暗君", description: "祂相信秩序。不是因为冷漠，而是因为见过足够多的混乱之后，明白唯有结构能保护那些脆弱的存在。祂颁布严苛的律令，却在深夜独自承担那些法令的重量。君王的暴戾是铠甲，内里是一个从未被允许软弱的人。", traits: { 自毁: 45, 理想: 80, 控制: 95, 情感: 40, 执念: 75, 秩序: 90 }, strengths: ["领导力天然，能在危机中迅速做出决策", "高度自律，行动力强", "对「正确」的事有近乎偏执的坚持"], weaknesses: ["对他人要求过高，容易孤立自己", "情感表达能力薄弱，难以建立真实的亲密关系", "权力感一旦失控，会走向独裁"] },
  { id: "phantom", name: "徘徊于存在边界的幽魂", short: "幽魂", description: "幽魂不完全属于这个世界。祂存在，却像雾一样难以被握住；祂在场，却让人感觉随时会消失。这不是逃避，是一种生存方式——当存在本身曾带来过痛苦，半透明就成了最安全的状态。但在某些时刻，幽魂会突然变得极度真实，令人无法忽视。", traits: { 自毁: 65, 理想: 50, 控制: 40, 情感: 60, 执念: 55, 秩序: 30 }, strengths: ["观察力极强，习惯从边缘看清全局", "情感感知细腻，能察觉他人未曾说出的痛苦", "在混乱中保持冷静的能力"], weaknesses: ["自我认同感薄弱，容易被他人的定义覆盖", "回避冲突，导致问题积压", "对自身存在的价值持续怀疑"] },
  { id: "martyr", name: "以燃烧自身为光的殉道者", short: "殉道者", description: "殉道者知道自己在燃烧。祂不是不疼，而是认为那道光值得。祂的给予没有保留，祂的牺牲没有条件。这是一种近乎偏执的利他——不是因为不在乎自己，而是因为在乎别人更多。代价是：祂终将耗尽。但那一刻到来之前，祂的光足以温暖整片黑暗。", traits: { 自毁: 85, 理想: 90, 控制: 30, 情感: 80, 执念: 70, 秩序: 50 }, strengths: ["利他精神极强，愿意为他人承担真实的代价", "道德感清晰，不妥协于利益", "能激励他人，是精神意义上的灯塔"], weaknesses: ["自我保护意识极低，容易被消耗殆尽", "有时将「牺牲」浪漫化，回避真正解决问题", "容易吸引索取型关系"] },
  { id: "architect", name: "在虚空中勾勒蓝图的造物主", short: "造物主", description: "造物主活在尚未存在的世界里。现实对祂而言是草稿，理想才是终稿。祂能看见别人看不见的结构，能在废墟中规划出宫殿的轮廓。问题在于——祂对「完成」的执着，有时超过了对「过程中的人」的关注。祂建造世界，却有时忘记世界里住着人。", traits: { 自毁: 35, 理想: 95, 控制: 80, 情感: 35, 执念: 85, 秩序: 75 }, strengths: ["远见卓识，能构想并推进复杂的长期目标", "创造力与执行力并存", "面对失败时能迅速重构方案"], weaknesses: ["情感联结能力弱，容易让人感到被工具化", "对「不完美」的容忍度低，容易陷入完美主义瘫痪", "有时为了愿景忽视当下真实的人际关系"] },
  { id: "mirror", name: "映照万物却无自身形态的镜", short: "虚镜", description: "镜的存在是为了反射。祂极擅长理解他人、适应他人、成为他人需要的样子——以至于当一切映像消散，祂发现自己不知道「本来面目」是什么。这不是虚伪，是一种极度敏感带来的自我消融。镜的危机不在于失去别人，而在于找回自己。", traits: { 自毁: 60, 理想: 45, 控制: 50, 情感: 85, 执念: 40, 秩序: 45 }, strengths: ["共情能力极强，几乎能感同身受任何人的处境", "社交适应力高，在任何群体中都能找到位置", "善于化解冲突，天然的调和者"], weaknesses: ["自我边界模糊，容易失去独立判断", "长期迎合他人导致内在的真实需求被压抑", "在关系破裂后容易陷入身份危机"] },
  { id: "storm", name: "裹挟一切向前的风暴核心", short: "风暴眼", description: "风暴眼是矛盾的：祂既是破坏，也是驱动。祂所到之处，静止的事物开始运动，安定的局面开始松动。这不是刻意为之——祂只是存在着，而存在本身就是一种力量。问题是，不是所有人都能在风暴中站稳。祂最亲近的人，往往也是被卷走的人。", traits: { 自毁: 55, 理想: 70, 控制: 25, 情感: 75, 执念: 60, 秩序: 20 }, strengths: ["行动力强，能打破僵局推动改变", "感染力强，能让身边的人燃起激情", "在危机中爆发出超常的能量"], weaknesses: ["冲动性强，容易在情绪高点做出影响深远的决定", "难以维持稳定的长期关系", "对「平静」感到不适，有时会无意识地制造动荡"] },
  { id: "abyss", name: "凝视深渊后选择微笑的人", short: "深渊笑者", description: "祂见过最深的黑暗——也许是自己内心的，也许是世界给的。而祂选择笑。不是因为不痛，而是因为痛到某个程度之后，眼泪变得多余，笑反而更诚实。这种笑里有悲悯，有洞彻，有一种「我什么都见过了，所以什么都能接受」的平静。但那份平静的底色，是无尽的疲倦。", traits: { 自毁: 70, 理想: 60, 控制: 60, 情感: 65, 执念: 50, 秩序: 40 }, strengths: ["心理韧性极强，能从极端逆境中复原", "对人性有深刻且不带评判的理解", "在他人崩溃时能成为稳定的支撑"], weaknesses: ["习惯用笑掩盖真实状态，导致需求长期不被看见", "自我疗愈能力强，但也因此习惯不寻求帮助", "内在的疲惫如果长期积压，会在某个意外时刻彻底崩塌"] },
];

const QUESTIONS = [
  { id: 1, text: "莫名拥有了杀人犯的记忆，分不清幻想与真实时，祂会——", options: ["独自承担，绝不让任何人知晓，哪怕在恐惧中独自崩溃", "理性切割，将记忆视为数据而非自我，继续前行", "主动寻找答案，哪怕那个答案会动摇祂对自己的认知"], weights: [{ 自毁: 20, 情感: -10, 控制: 10 }, { 控制: 20, 自毁: -10, 秩序: 10 }, { 理想: 15, 执念: 15, 自毁: -5 }] },
  { id: 2, text: "拥有统治一个王国的权力，祂颁布的第一条政令会是——", options: ["废除所有形式的刑罚——哪怕这会让秩序崩溃", "建立一套绝对公平的法典，无论代价多少人反对", "将权力下放，让每个人决定自己的命运"], weights: [{ 自毁: 15, 理想: 20, 秩序: -10 }, { 控制: 20, 秩序: 20, 情感: -10 }, { 执念: -10, 秩序: -15, 情感: 15 }] },
  { id: 3, text: "在极端情况下，祂会突破哪条道德底线——", options: ["出卖一个无辜者，以拯救更多人", "亲手终结一段生命，若那是唯一的救赎", "什么都不做——因为任何选择都是罪，不选才是最后的清白"], weights: [{ 控制: 15, 情感: -15, 秩序: 10 }, { 自毁: 20, 执念: 15, 理想: -10 }, { 执念: 20, 自毁: 10, 控制: -20 }] },
  { id: 4, text: "祂的灵魂颜色与形态，最接近——", options: ["深蓝色的浓雾，边界模糊，触碰时会穿过手心", "碎裂的琥珀，每一片都透着光，合在一起却是残缺的圆", "白金色的火焰，安静地燃烧，从不熄灭，也从不蔓延"], weights: [{ 情感: 15, 控制: -10, 秩序: -15 }, { 自毁: 20, 理想: 10, 执念: 15 }, { 理想: 20, 控制: 15, 自毁: -10 }] },
  { id: 5, text: "若祂知道自己的某个决定会摧毁一段关系，祂会——", options: ["依然做出那个决定，因为关系不能成为真相的枷锁", "寻找第三条路，即便那条路不存在也要走下去", "放弃那个决定，因为失去那个人对祂而言等于失去自己"], weights: [{ 理想: 20, 情感: -15, 执念: 10 }, { 执念: 20, 控制: 10, 自毁: 10 }, { 执念: 25, 情感: 20, 自毁: 15 }] },
  { id: 6, text: "有人为了祂做出了极大的牺牲。祂的第一反应是——", options: ["愤怒——谁允许你这么做的，这不公平", "愧疚——这笔债我用一生都还不清", "沉默——因为感激与悲伤同时涌来，任何语言都太轻"], weights: [{ 控制: -10, 情感: 20, 自毁: 10 }, { 执念: 20, 自毁: 15, 秩序: -5 }, { 情感: 15, 自毁: 20, 控制: 10 }] },
  { id: 7, text: "祂独自面对漫长黑夜时，内心最真实的声音是——", options: ["「等到天亮就好了」——守望黎明本身就是一种意义", "「也许这才是真实」——黑暗反而让祂感到某种诡异的安心", "「我不知道我在等什么」——但停下来是不可能的"], weights: [{ 理想: 20, 自毁: -10, 执念: 15 }, { 自毁: 20, 秩序: -15, 情感: 10 }, { 执念: 15, 控制: 15, 理想: -5 }] },
  { id: 8, text: "祂最恐惧的不是死亡，而是——", options: ["被遗忘——消失之后，好像从未存在过", "失控——那一刻起，祂将成为自己最害怕的东西", "虚度——用尽了时间，却什么也没留下"], weights: [{ 执念: 20, 情感: 15, 控制: -10 }, { 控制: 25, 秩序: 15, 自毁: 10 }, { 理想: 25, 执念: 10, 情感: -5 }] },
  { id: 9, text: "如果命运允许祂选择自己的结局，祂会选择——", options: ["在完成某件重要的事之后，安静地消失", "燃烧到最后一刻，哪怕灰烬都被风吹散", "留下来，以任何形式，只要能继续存在"], weights: [{ 理想: 20, 控制: 15, 自毁: -5 }, { 自毁: 20, 理想: 15, 执念: 10 }, { 执念: 25, 情感: 20, 自毁: 15 }] },
  { id: 10, text: "祂与「权力」的关系，最接近——", options: ["工具——必要时使用，但从不沉迷", "负担——拥有它意味着必须为它的后果负责", "渴望——但那份渴望令祂羞耻，所以从不承认"], weights: [{ 控制: 15, 秩序: 10, 执念: -5 }, { 自毁: 15, 理想: 10, 控制: 10 }, { 执念: 20, 自毁: 15, 情感: -10 }] },
  { id: 11, text: "祂会如何对待一个曾深深伤害过祂的人——", options: ["以德报怨——不是因为善良，而是不想让仇恨定义自己", "保持距离——原谅，但不靠近", "等待——等那个人的命运自行偿还"], weights: [{ 理想: 20, 自毁: 10, 执念: -10 }, { 控制: 15, 秩序: 10, 情感: -5 }, { 执念: 25, 情感: -5, 秩序: 10 }] },
  { id: 12, text: "在祂的世界里，「背叛」最准确的定义是——", options: ["在我最需要时转身离开", "以我的名义做我最不愿意的事", "让我开始怀疑自己曾经相信的一切"], weights: [{ 情感: 25, 执念: 15, 控制: -10 }, { 控制: 20, 秩序: 15, 理想: -5 }, { 执念: 20, 自毁: 15, 理想: -10 }] },
  { id: 13, text: "祂对「孤独」的感受，是——", options: ["某种程度上的解脱——不再需要表演「没事」", "隐隐的痛，但比被人误解更能忍受", "一种确认——证明自己本来就不属于任何地方"], weights: [{ 控制: 15, 情感: -10, 自毁: 10 }, { 自毁: 15, 情感: 10, 秩序: -5 }, { 自毁: 25, 执念: 10, 情感: -15 }] },
  { id: 14, text: "如果祂的一生只能留下一样东西，祂会选择——", options: ["某个人永远记得祂的方式", "祂亲手改变的某个结果", "某个只有祂知道的秘密真相"], weights: [{ 情感: 25, 执念: 20, 理想: -5 }, { 理想: 25, 控制: 15, 自毁: -10 }, { 执念: 20, 自毁: 15, 情感: -10 }] },
  { id: 15, text: "有人问祂：「你还好吗？」祂真实的反应是——", options: ["说「还好」，因为解释比假装更累", "问对方「你为什么这么问」，因为祂需要先确认动机", "沉默几秒，然后说「还好」，但那几秒说明了一切"], weights: [{ 自毁: 15, 控制: 10, 情感: -15 }, { 控制: 20, 执念: 10, 情感: -10 }, { 情感: 20, 自毁: 20, 控制: -5 }] },
  { id: 16, text: "祂认为「强大」的真正含义是——", options: ["在所有人崩溃之后，依然还站着", "知道自己什么时候需要停下来", "让身边的人不再需要强大"], weights: [{ 控制: 20, 自毁: 15, 情感: -10 }, { 控制: 15, 秩序: 10, 自毁: -15 }, { 理想: 20, 情感: 20, 执念: -5 }] },
  { id: 17, text: "如果祂发现自己所坚信的某件事是谎言，祂会——", options: ["重建——找到新的坚信之物，无论代价", "沉默——承认，然后继续，因为没有其他选项", "崩塌——因为那件事曾是祂存在的核心"], weights: [{ 理想: 25, 控制: 15, 自毁: -10 }, { 控制: 20, 自毁: 10, 情感: -15 }, { 执念: 25, 自毁: 25, 控制: -15 }] },
  { id: 18, text: "祂对自己的「过去」，持怎样的态度——", options: ["那是我，我不回避，也不沉溺", "那是我曾经的错误，我要用余生来偿还", "那是陌生人的故事，我只是碰巧知道细节"], weights: [{ 控制: 20, 秩序: 15, 自毁: -10 }, { 自毁: 25, 执念: 20, 控制: -5 }, { 自毁: 15, 情感: -20, 执念: -10 }] },
  { id: 19, text: "有人说：「没有你，他们会过得更好。」祂的内心深处——", options: ["知道这是谎言，但谎言有时候比真相更难反驳", "已经想过这个问题了，结论悬而未决", "相信这句话，但选择留下，因为离开也是一种伤害"], weights: [{ 自毁: 15, 控制: 20, 执念: 10 }, { 自毁: 25, 执念: 15, 理想: -10 }, { 自毁: 20, 执念: 25, 情感: 15 }] },
  { id: 20, text: "如果祂是一种天气，祂最接近——", options: ["长久的阴天——不压抑，只是光线总是不够", "雷雨前的片刻寂静——平静里藏着即将到来的一切", "深冬的晴日——刺骨，但清澈，让人看清一切"], weights: [{ 自毁: 10, 情感: 15, 控制: -10 }, { 执念: 20, 控制: 15, 情感: -5 }, { 控制: 20, 理想: 15, 情感: -15 }] },
  { id: 21, text: "祂最不能接受的失去，是——", options: ["失去对「意义」的感知——从此做什么都是空洞的", "失去某个具体的人——那个人是祂存在的锚", "失去对自己的认知——不再知道自己是谁"], weights: [{ 理想: 25, 执念: -5, 自毁: 15 }, { 执念: 30, 情感: 20, 自毁: 15 }, { 自毁: 25, 执念: 15, 控制: -10 }] },
  { id: 22, text: "当祂所爱的人走向一条祂认为错误的路，祂会——", options: ["跟上去，即便那条路通向深渊", "拦住祂，哪怕为此成为对方的敌人", "在原地等待，因为有些路必须自己走完才能回头"], weights: [{ 执念: 25, 自毁: 20, 控制: -10 }, { 控制: 20, 理想: 15, 情感: -10 }, { 理想: 15, 控制: 15, 执念: -10 }] },
  { id: 23, text: "祂相信「命运」吗——", options: ["相信。并且在和它博弈", "不相信。所以祂用行动制造属于自己的轨迹", "不确定。但祂选择活得像相信一样"], weights: [{ 执念: 20, 控制: 15, 理想: 10 }, { 控制: 25, 理想: 20, 执念: -10 }, { 情感: 15, 理想: 10, 自毁: 10 }] },
  { id: 24, text: "祂内心最隐秘的恐惧，最接近——", options: ["有一天发现自己已经成为了曾经最厌恶的那种人", "用尽所有力气，结果什么都没有改变", "某段关系在对方心里从未真实存在过"], weights: [{ 自毁: 20, 控制: -15, 秩序: 15 }, { 理想: 25, 自毁: 15, 执念: 10 }, { 执念: 25, 情感: 20, 自毁: 15 }] },
  { id: 25, text: "若祂可以对过去的自己说一句话，祂会说——", options: ["「你不需要为了留住任何人而缩小自己」", "「那件事不是你的错，不是，真的不是」", "「你已经尽力了——而且那已经足够」"], weights: [{ 自毁: -15, 控制: 20, 情感: 10 }, { 自毁: 25, 执念: 15, 情感: -5 }, { 自毁: 20, 理想: -10, 情感: 20 }] },
  { id: 26, text: "祂如何看待「规则」——", options: ["规则是脆弱者需要的结构，足够强大的人自己就是规则", "规则是最基本的契约，破坏它就是背叛所有选择相信它的人", "规则是起点，不是终点——在无法适用时需要被超越"], weights: [{ 控制: 25, 秩序: -15, 理想: -5 }, { 秩序: 25, 控制: 15, 自毁: -10 }, { 理想: 20, 控制: 10, 秩序: -5 }] },
  { id: 27, text: "祂对「爱」最诚实的定义是——", options: ["一种选择——在足够多的理由之后，依然选择留下", "一种痛——因为足够在乎，所以足够脆弱", "一种负债——祂不确定自己给得起"], weights: [{ 执念: 15, 控制: 20, 情感: -5 }, { 情感: 25, 执念: 20, 控制: -10 }, { 自毁: 20, 执念: 10, 情感: -20 }] },
  { id: 28, text: "祂最害怕的一种凝视，是——", options: ["那种看穿祂全部秘密的目光，却选择留下", "那种充满期待的目光，期待祂成为祂做不到的样子", "那种已经失去光芒的目光，属于曾经爱过祂的人"], weights: [{ 自毁: 20, 情感: 15, 控制: -5 }, { 理想: -10, 自毁: 15, 控制: 20 }, { 执念: 25, 情感: 25, 自毁: 20 }] },
  { id: 29, text: "祂会如何终结一段不再正确的关系——", options: ["保持沉默，直到对方明白，因为开口太残忍", "直接，清晰，哪怕对方因此憎恨祂", "找一个「祂犯错」的理由，让对方主动离开"], weights: [{ 自毁: 15, 情感: 10, 控制: -15 }, { 控制: 20, 秩序: 15, 情感: -15 }, { 自毁: 25, 执念: 15, 控制: -20 }] },
  { id: 30, text: "祂有没有一个「如果当初」的时刻——", options: ["有，但祂已经与它和解，它只是一个故事", "有，它是祂所有行动的燃料，不能和解", "有，但那个如果到底会不会更好，祂不敢想"], weights: [{ 理想: 20, 自毁: -10, 控制: 15 }, { 执念: 30, 自毁: 20, 理想: -5 }, { 自毁: 15, 执念: 15, 控制: -10 }] },
  { id: 31, text: "祂如何看待那些向祂寻求帮助的人——", options: ["责任——既然来了，就不能空手而返", "脆弱的镜子——在帮助他们的同时，看见自己曾经的影子", "信任的重量——被需要让祂感到真实存在"], weights: [{ 控制: 20, 理想: 15, 自毁: -5 }, { 情感: 25, 自毁: 10, 执念: 10 }, { 执念: 20, 情感: 20, 自毁: 15 }] },
  { id: 32, text: "有人无条件地信任祂。祂的感受是——", options: ["沉重——那份信任是枷锁，也是支柱", "惶恐——祂知道自己值不值得，不确定", "珍贵——那是祂在这个世界上最不愿失去的东西"], weights: [{ 自毁: 15, 控制: 15, 执念: 10 }, { 自毁: 25, 执念: 15, 理想: -10 }, { 执念: 25, 情感: 25, 自毁: 10 }] },
  { id: 33, text: "祂的「沉默」通常意味着——", options: ["正在思考，语言追不上内心的速度", "正在压抑，说出来只会让事情更糟", "已经放弃，因为说了也没有用"], weights: [{ 控制: 20, 理想: 10, 情感: -10 }, { 自毁: 20, 情感: -15, 控制: 10 }, { 自毁: 25, 执念: 10, 理想: -15 }] },
  { id: 34, text: "当祂做错了某件无法弥补的事，祂会——", options: ["用余生的行动来偿还，即便对方已经不在", "接受，然后带着这个重量继续前行", "在某个深夜反复重温那个时刻，无法离开"], weights: [{ 执念: 25, 自毁: 20, 理想: 10 }, { 控制: 20, 理想: 15, 自毁: -5 }, { 执念: 30, 自毁: 30, 控制: -20 }] },
  { id: 35, text: "祂眼中的「英雄主义」，最接近——", options: ["在没有人看见的地方，依然做出正确的选择", "用自己的毁灭换取他人的存续", "在所有人都说不可能时，依然继续"], weights: [{ 理想: 25, 控制: 15, 自毁: -10 }, { 自毁: 25, 理想: 20, 执念: 15 }, { 执念: 20, 理想: 20, 控制: 10 }] },
  { id: 36, text: "对祂而言，「家」是什么——", options: ["一个人——无论祂身在何处，那个人在哪里，家就在哪里", "一种状态——不需要表演，不需要解释的片刻", "一个遥远的概念，祂一直在寻找，一直没有找到"], weights: [{ 执念: 30, 情感: 25, 控制: -10 }, { 控制: 15, 情感: 15, 自毁: -10 }, { 自毁: 20, 执念: 15, 情感: -15 }] },
  { id: 37, text: "祂对自己的身体，是——", options: ["工具——只要还能用，就不会特别在意", "战场——它承载了太多，祂有时对它感到陌生", "祂与这个世界唯一真实的连接点"], weights: [{ 控制: 20, 自毁: 10, 情感: -15 }, { 自毁: 25, 执念: 10, 情感: -10 }, { 情感: 20, 执念: 15, 自毁: -5 }] },
  { id: 38, text: "祂认为自己最大的「谎言」是——", options: ["「我没事」——说了不知道多少次", "「我不在乎」——而事实上，祂一直都在乎", "「我不需要任何人」——而这句话本身就是证明"], weights: [{ 自毁: 20, 情感: -15, 控制: 15 }, { 执念: 25, 情感: 15, 控制: -10 }, { 自毁: 25, 执念: 20, 情感: -20 }] },
  { id: 39, text: "祂最无法理解的人类行为是——", options: ["明知道某件事会伤害自己，却反复去做", "为了「合群」而抛弃自己真实的想法", "已经得到了，还要继续索取"], weights: [{ 控制: 20, 秩序: 15, 自毁: -10 }, { 控制: 15, 理想: 10, 执念: -5 }, { 理想: 15, 秩序: 10, 执念: 10 }] },
  { id: 40, text: "如果可以选择，祂更愿意——", options: ["知道一切真相，哪怕那些真相摧毁了美好", "生活在一个精心构造的谎言里，但感到幸福", "既不知道真相，也不欺骗自己，只是继续往前"], weights: [{ 理想: 25, 控制: 20, 自毁: 10 }, { 执念: -10, 情感: 20, 理想: -20 }, { 控制: 15, 自毁: 10, 执念: -5 }] },
  { id: 41, text: "祂害怕成为——", options: ["某种「必要的恶」——为了正确的结果使用错误的手段", "一个透明的人——在所有人的生命里，祂离开了也没有痕迹", "自己曾经最想要保护的那种脆弱"], weights: [{ 理想: -15, 控制: 15, 秩序: 20 }, { 情感: -20, 执念: 20, 自毁: 25 }, { 自毁: 20, 控制: -10, 情感: 15 }] },
  { id: 42, text: "当祂感到极度脆弱时，祂会——", options: ["变得更冷——因为软化了就无法重新硬起来", "寻找某个角落消失一段时间，直到恢复", "找一个人——那个唯一被允许看见祂崩塌的人"], weights: [{ 控制: 25, 情感: -20, 秩序: 10 }, { 自毁: 15, 情感: -10, 控制: 15 }, { 执念: 25, 情感: 25, 自毁: -5 }] },
  { id: 43, text: "对祂而言，「死亡」意味着——", options: ["终止——一切问题的终止，不是解脱，只是停止", "延续——以另一种形式，祂留下的东西还在", "未知——祂对那个答案既恐惧又好奇"], weights: [{ 自毁: 20, 理想: -10, 执念: 10 }, { 理想: 25, 执念: 20, 自毁: -5 }, { 执念: 15, 自毁: 10, 控制: -15 }] },
  { id: 44, text: "若祂的故事注定是一场悲剧，祂会——", options: ["改写它——哪怕要与命运正面对抗", "接受它，但让那个悲剧拥有某种尊严", "在悲剧到来之前，先燃烧尽自己所有的光"], weights: [{ 控制: 25, 理想: 20, 执念: 15 }, { 理想: 20, 控制: 15, 自毁: -5 }, { 自毁: 30, 理想: 15, 执念: 20 }] },
  { id: 45, text: "祂对「时间」的感知，最接近——", options: ["流沙——明明抓紧了，还是从指缝漏走", "债务——欠下了太多，不知如何偿还", "河流——祂只是其中一段，上游和下游都不属于祂"], weights: [{ 执念: 20, 控制: -15, 自毁: 15 }, { 自毁: 20, 执念: 15, 理想: -10 }, { 理想: 15, 控制: 10, 执念: -10 }] },
  { id: 46, text: "祂相信自己最终会——", options: ["完成某件重要的事，然后消失", "被某个人真正看见并选择留下", "成为自己曾经害怕成为的那种人"], weights: [{ 理想: 25, 自毁: 10, 执念: 15 }, { 执念: 25, 情感: 30, 自毁: -5 }, { 自毁: 30, 执念: 15, 控制: -20 }] },
  { id: 47, text: "如果祂的内心有一扇永远锁着的门，门后面是——", options: ["一个祂曾经放弃的版本的自己", "某段记忆，那段记忆如果解封会改变一切", "一个问题，那个问题的答案祂其实早已知道"], weights: [{ 自毁: 20, 执念: 15, 理想: -10 }, { 执念: 25, 自毁: 20, 控制: -10 }, { 控制: 20, 自毁: 15, 理想: 10 }] },
  { id: 48, text: "祂眼中「最残忍」的事，是——", options: ["给予希望，然后亲手取走", "让一个人爱上一个不会爱他的世界", "让一个人在最孤独的时刻相信这是他应得的"], weights: [{ 执念: 20, 情感: 15, 理想: -10 }, { 情感: 25, 理想: 15, 自毁: -5 }, { 自毁: 20, 情感: 20, 执念: 15 }] },
  { id: 49, text: "祂对「自由」最真实的渴望，是——", options: ["不再需要解释自己存在的理由", "不再为某个人的反应调整自己的行为", "不再需要在某件事与自己之间做选择"], weights: [{ 自毁: -10, 控制: 20, 理想: 15 }, { 控制: 15, 执念: -15, 情感: 20 }, { 执念: 20, 自毁: 10, 理想: 10 }] },
  { id: 50, text: "最后，如果用一句话描述祂，祂最愿意被这样记住——", options: ["「祂来过，祂做过，这就够了」", "「祂爱过，被爱过，也为此付出过代价」", "「祂从未真正被理解，但从未停止尝试」"], weights: [{ 理想: 20, 控制: 15, 自毁: -5 }, { 情感: 25, 执念: 20, 自毁: 10 }, { 自毁: 15, 理想: 15, 情感: -5 }] },
];

const TRAIT_KEYS = ["自毁", "理想", "控制", "情感", "执念", "秩序"];

function createMusicEngine(ctx) {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.18;
  masterGain.connect(ctx.destination);
  const reverb = ctx.createConvolver();
  const reverbLen = ctx.sampleRate * 3;
  const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = reverbBuf.getChannelData(c);
    for (let i = 0; i < reverbLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5);
  }
  reverb.buffer = reverbBuf;
  reverb.connect(masterGain);
  const dryGain = ctx.createGain(); dryGain.gain.value = 0.3; dryGain.connect(masterGain);
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.7; wetGain.connect(reverb);
  function playNote(freq, time, duration, vol = 0.5) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain); gain.connect(dryGain); gain.connect(wetGain);
    osc.start(time); osc.stop(time + duration + 0.1);
  }
  const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];
  const bassScale = [73.42, 82.41, 92.50, 110.00, 123.47];
  let loopId = null, stopped = false;
  function scheduleLoop(startTime) {
    if (stopped) return;
    const tempo = 2.8;
    const pattern = [0, 4, 2, 6, 1, 5, 3, 7, 2, 4, 0, 6, 3, 5, 1, 4];
    const bassPattern = [0, 2, 1, 3, 0, 2, 4, 1];
    pattern.forEach((idx, i) => {
      playNote(scale[idx % scale.length], startTime + i * tempo * 0.5, tempo * 0.8, 0.35);
      if (i % 3 === 0) playNote(scale[(idx + 2) % scale.length] * 2, startTime + i * tempo * 0.5 + 0.15, tempo * 0.4, 0.15);
    });
    bassPattern.forEach((idx, i) => { playNote(bassScale[idx], startTime + i * tempo, tempo * 1.6, 0.25); });
    const totalDur = pattern.length * tempo * 0.5;
    loopId = setTimeout(() => scheduleLoop(ctx.currentTime + 0.05), (totalDur - 0.5) * 1000);
  }
  return {
    start() { stopped = false; scheduleLoop(ctx.currentTime + 0.1); },
    stop() { stopped = true; clearTimeout(loopId); masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); },
  };
}

function playChime(ctx) {
  if (!ctx) return;
  const freqs = [1046.50, 1318.51, 1567.98];
  const reverb = ctx.createConvolver();
  const rLen = ctx.sampleRate * 1.5;
  const rBuf = ctx.createBuffer(2, rLen, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = rBuf.getChannelData(c);
    for (let i = 0; i < rLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rLen, 3);
  }
  reverb.buffer = rBuf;
  const out = ctx.createGain(); out.gain.value = 0.25; out.connect(ctx.destination);
  reverb.connect(out);
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine"; osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.04;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    osc.connect(g); g.connect(reverb); g.connect(out);
    osc.start(t); osc.stop(t + 2);
  });
}

// Firework star burst component
function StarBurst({ x, y, onDone }) {
  const count = 14;
  const stars = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const dist = 40 + Math.random() * 30;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, size: 3 + Math.random() * 3 };
  });
  useEffect(() => { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 9999 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.size, height: s.size,
          background: "#4a9eff", borderRadius: "50%",
          boxShadow: "0 0 6px 2px #4a9eff, 0 0 12px 4px #2060ff",
          clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          animation: `burst-${i} 0.65s ease-out forwards`,
          left: -s.size / 2, top: -s.size / 2,
        }} />
      ))}
      <style>{stars.map((s, i) => `
        @keyframes burst-${i} {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(${s.dx}px, ${s.dy}px) scale(0); opacity: 0; }
        }
      `).join("")}</style>
    </div>
  );
}

// Crow SVG component - fully animated
function Crow({ onClick }) {
  const [state, setState] = useState("idle");
  const [looking, setLooking] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    function schedule() {
      const delay = 3000 + Math.random() * 5000;
      timerRef.current = setTimeout(() => {
        const r = Math.random();
        if (r < 0.4) {
          setState("flap");
          setTimeout(() => { setState("idle"); schedule(); }, 800);
        } else if (r < 0.7) {
          setLooking(true);
          setTimeout(() => { setLooking(false); schedule(); }, 2000);
        } else {
          schedule();
        }
      }, delay);
    }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleClick() {
    clearTimeout(timerRef.current);
    setState("flap");
    playChimeSound();
    setTimeout(() => {
      setState("idle");
      timerRef.current = setTimeout(function schedule() {
        const delay = 3000 + Math.random() * 5000;
        timerRef.current = setTimeout(() => {
          const r = Math.random();
          if (r < 0.4) { setState("flap"); setTimeout(() => { setState("idle"); }, 800); }
          else if (r < 0.7) { setLooking(true); setTimeout(() => setLooking(false), 2000); }
          timerRef.current = setTimeout(schedule, delay);
        }, delay);
      }, 100);
    }, 600);
    if (onClick) onClick();
  }

  const wingL = state === "flap" ? "M 30 38 Q 10 20 5 8 Q 20 22 30 30" : "M 30 38 Q 12 32 8 28 Q 18 30 30 34";
  const wingR = state === "flap" ? "M 46 38 Q 66 20 71 8 Q 56 22 46 30" : "M 46 38 Q 64 32 68 28 Q 58 30 46 34";
  const eyeX = looking ? 44 : 42;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed", bottom: 18, right: 18, width: 76, height: 76,
        cursor: "pointer", zIndex: 100,
        animation: "crowBob 3s ease-in-out infinite alternate",
        filter: "drop-shadow(0 0 8px rgba(80,120,255,0.4))",
      }}
    >
      <style>{`
        @keyframes crowBob { 0%{transform:translateY(0)} 100%{transform:translateY(-6px)} }
      `}</style>
      <svg viewBox="0 0 76 76" width="76" height="76">
        {/* glow */}
        <ellipse cx="38" cy="68" rx="18" ry="4" fill="rgba(60,90,200,0.18)" />
        {/* legs */}
        <line x1="33" y1="62" x2="28" y2="70" stroke="#1a2a5a" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="70" x2="23" y2="70" stroke="#1a2a5a" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="28" y1="70" x2="27" y2="73" stroke="#1a2a5a" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="43" y1="62" x2="48" y2="70" stroke="#1a2a5a" strokeWidth="2" strokeLinecap="round"/>
        <line x1="48" y1="70" x2="53" y2="70" stroke="#1a2a5a" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="48" y1="70" x2="49" y2="73" stroke="#1a2a5a" strokeWidth="1.5" strokeLinecap="round"/>
        {/* tail */}
        <path d="M 28 58 Q 20 64 18 68 Q 30 60 38 62 Q 46 60 58 68 Q 56 64 48 58" fill="#12184a" />
        {/* body */}
        <ellipse cx="38" cy="46" rx="16" ry="18" fill="#16205a" />
        {/* wings */}
        <path d={wingL} fill="#0e1640" stroke="#1e2d80" strokeWidth="1"
          style={{ transition: "d 0.2s ease" }} />
        <path d={wingR} fill="#0e1640" stroke="#1e2d80" strokeWidth="1"
          style={{ transition: "d 0.2s ease" }} />
        {/* wing shine */}
        <path d="M 20 42 Q 18 36 22 32" stroke="rgba(100,140,255,0.3)" strokeWidth="1" fill="none"/>
        <path d="M 56 42 Q 58 36 54 32" stroke="rgba(100,140,255,0.3)" strokeWidth="1" fill="none"/>
        {/* neck */}
        <ellipse cx="38" cy="30" rx="9" ry="10" fill="#16205a" />
        {/* head */}
        <ellipse cx="40" cy="20" rx="10" ry="9" fill="#16205a" />
        {/* head shine */}
        <ellipse cx="37" cy="16" rx="4" ry="2.5" fill="rgba(100,140,255,0.15)" transform="rotate(-20,37,16)"/>
        {/* beak */}
        <path d="M 49 21 L 56 23 L 49 25 Z" fill="#2a3a8a" />
        {/* eye */}
        <circle cx={eyeX} cy="19" r="3.5" fill="#0a0f2a" />
        <circle cx={eyeX} cy="19" r="2" fill="#1a2a6a" />
        <circle cx={eyeX + 0.8} cy="17.8" r="0.8" fill="rgba(180,210,255,0.9)" />
        {/* blue feather shimmer */}
        <path d="M 26 36 Q 22 28 26 22" stroke="rgba(60,100,255,0.2)" strokeWidth="1.5" fill="none"/>
      </svg>
    </div>
  );
}

// global audio ctx ref so crow can access it
let globalAudioCtx = null;
function playChimeSound() { playChime(globalAudioCtx); }

function RadarChart({ traits }) {
  const size = 220, cx = 110, cy = 110, r = 80;
  const n = TRAIT_KEYS.length;
  const angles = TRAIT_KEYS.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map(level =>
    angles.map(a => `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`).join(" ")
  );
  const dataPoints = TRAIT_KEYS.map((key, i) => {
    const val = Math.min(traits[key] || 0, 100) / 100;
    return { x: cx + r * val * Math.cos(angles[i]), y: cy + r * val * Math.sin(angles[i]) };
  });
  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  const labels = TRAIT_KEYS.map((key, i) => ({ key, x: cx + (r + 22) * Math.cos(angles[i]), y: cy + (r + 22) * Math.sin(angles[i]) }));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridPolygons.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="rgba(100,149,237,0.2)" strokeWidth="1" />)}
      {angles.map((a, i) => <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(100,149,237,0.15)" strokeWidth="1" />)}
      <polygon points={polyPoints} fill="rgba(100,149,237,0.25)" stroke="#6495ed" strokeWidth="1.5" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#a8c4f0" />)}
      {labels.map(({ key, x, y }) => (
        <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#a8c4f0" fontSize="11" fontFamily="'Ma Shan Zheng', serif">{key}</text>
      ))}
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState({ name: false, radar: false, analysis: false });
  const [particles, setParticles] = useState([]);
  const [pronouns] = useState(["他", "她", "祂"]);
  const [selectedPronoun, setSelectedPronoun] = useState("祂");
  const [bursts, setBursts] = useState([]);
  const audioCtxRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const ps = Array.from({ length: 60 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 3 + 1, delay: Math.random() * 8,
      duration: Math.random() * 6 + 5,
      driftX: (Math.random() - 0.5) * 40, driftY: (Math.random() - 0.5) * 40,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(ps);
  }, []);

  function startMusic() {
    if (audioCtxRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      globalAudioCtx = ctx;
      const engine = createMusicEngine(ctx);
      engineRef.current = engine;
      engine.start();
    } catch (e) {}
  }

  function spawnBurst(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const id = Date.now() + Math.random();
    setBursts(b => [...b, { id, x, y }]);
    playChime(audioCtxRef.current);
  }

  function removeBurst(id) { setBursts(b => b.filter(x => x.id !== id)); }

  function computeResult() {
    const scores = {};
    TRAIT_KEYS.forEach(k => scores[k] = 50);
    Object.values(answers).forEach(({ question, optionIdx }) => {
      const w = question.weights[optionIdx];
      Object.entries(w).forEach(([k, v]) => { scores[k] = Math.min(100, Math.max(0, (scores[k] || 50) + v)); });
    });
    let best = PERSONALITIES[0], bestScore = -Infinity;
    PERSONALITIES.forEach(p => {
      let s = 0;
      TRAIT_KEYS.forEach(k => { s -= Math.abs((p.traits[k] || 50) - scores[k]); });
      if (s > bestScore) { bestScore = s; best = p; }
    });
    return { personality: best, traits: scores };
  }

  function handleAnswer(q, idx) {
    const newAnswers = { ...answers, [q.id]: { question: q, optionIdx: idx } };
    setAnswers(newAnswers);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 250);
    } else {
      const r = computeResult();
      setResult(r);
      setScreen("result");
      setTimeout(() => setRevealed(v => ({ ...v, name: true })), 800);
      setTimeout(() => setRevealed(v => ({ ...v, radar: true })), 2000);
      setTimeout(() => setRevealed(v => ({ ...v, analysis: true })), 3200);
    }
  }

  function goBack() { if (current > 0) setCurrent(c => c - 1); }
  const progress = ((current + 1) / QUESTIONS.length) * 100;
  const replacePronouns = t => t.replace(/他\/她\/祂/g, selectedPronoun).replace(/祂/g, selectedPronoun);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a18; color: #c8d8f0; font-family: 'ZCOOL XiaoWei', serif; min-height: 100vh; overflow-x: hidden; }

        .app { min-height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; padding: 20px 20px 80px; }
        .bg { position: fixed; inset: 0; background: radial-gradient(ellipse at 30% 20%, #0a1535 0%, #050a18 60%); z-index: 0; }

        .particle {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 1;
          background: #4a8fd4;
          clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
          animation: particleDrift var(--dur) var(--del) infinite ease-in-out alternate;
        }
        @keyframes particleDrift {
          0% { opacity: 0.1; transform: translate(0,0) scale(0.7); }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; transform: translate(var(--dx),var(--dy)) scale(1.4); }
        }

        .card { position: relative; z-index: 10; background: rgba(5,15,40,0.82); border: 1px solid rgba(100,149,237,0.2); border-radius: 16px; padding: 40px; max-width: 680px; width: 100%; backdrop-filter: blur(24px); box-shadow: 0 0 60px rgba(30,80,180,0.15), inset 0 1px 0 rgba(100,149,237,0.1); }

        .float-text { animation: floatText 4s ease-in-out infinite alternate; display: inline-block; }
        .float-text-2 { animation: floatText 5s 0.8s ease-in-out infinite alternate; display: inline-block; }
        .float-text-3 { animation: floatText 6s 1.6s ease-in-out infinite alternate; display: inline-block; }
        @keyframes floatText { 0%{transform:translateY(0);opacity:0.85} 100%{transform:translateY(-10px);opacity:1} }

        .title-main { font-family: 'Ma Shan Zheng', serif; font-size: 2rem; color: #a8c4f0; text-align: center; letter-spacing: 0.15em; line-height: 1.4; margin-bottom: 12px; text-shadow: 0 0 30px rgba(100,149,237,0.5); }
        .subtitle { text-align: center; color: #5a7ab0; font-size: 0.85rem; letter-spacing: 0.2em; margin-bottom: 32px; }
        .divider { width: 60px; height: 1px; background: linear-gradient(90deg,transparent,#4a7ad4,transparent); margin: 24px auto; }

        .pronoun-section { text-align: center; margin-bottom: 28px; }
        .pronoun-label { font-size: 0.8rem; color: #4a6a9a; letter-spacing: 0.15em; margin-bottom: 12px; }
        .pronoun-btns { display: flex; gap: 12px; justify-content: center; }

        /* Frosted glass buttons */
        .pronoun-btn {
          padding: 8px 20px; border-radius: 20px;
          border: 1px solid rgba(100,149,237,0.3);
          background: rgba(15,30,80,0.35);
          backdrop-filter: blur(12px);
          color: #7a9ad0; font-family: 'ZCOOL XiaoWei', serif; font-size: 1rem; cursor: pointer;
          transition: all 0.3s;
          animation: btnFloat 3.5s ease-in-out infinite alternate;
        }
        .pronoun-btn:nth-child(2) { animation-delay: 0.5s; }
        .pronoun-btn:nth-child(3) { animation-delay: 1s; }
        .pronoun-btn.active { background: rgba(40,80,200,0.3); border-color: #6495ed; color: #a8c4f0; box-shadow: 0 0 12px rgba(100,149,237,0.25); }
        .pronoun-btn:hover { background: rgba(40,80,180,0.35); border-color: rgba(100,149,237,0.5); color: #c8d8f0; transform: translateY(-3px) !important; }

        .start-btn {
          display: block; width: 100%; padding: 16px;
          background: rgba(20,50,130,0.35);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(100,149,237,0.4); border-radius: 8px;
          color: #a8c4f0; font-family: 'Ma Shan Zheng', serif; font-size: 1.1rem; letter-spacing: 0.2em;
          cursor: pointer; transition: all 0.4s; margin-top: 8px;
          animation: btnFloat 4s 0.3s ease-in-out infinite alternate;
        }
        .start-btn:hover { background: rgba(50,100,200,0.4); border-color: #6495ed; box-shadow: 0 0 20px rgba(100,149,237,0.25); transform: translateY(-3px) !important; }

        @keyframes btnFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-5px)} }

        .progress-bar { width: 100%; height: 2px; background: rgba(100,149,237,0.1); border-radius: 2px; margin-bottom: 32px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg,#2a5ab0,#6495ed); border-radius: 2px; transition: width 0.4s ease; box-shadow: 0 0 8px rgba(100,149,237,0.5); }

        .q-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .q-counter { font-size: 0.75rem; color: #3a5a8a; letter-spacing: 0.3em; }

        .back-btn {
          background: rgba(10,20,60,0.35); backdrop-filter: blur(10px);
          border: 1px solid rgba(100,149,237,0.2); border-radius: 6px;
          color: #4a6a9a; font-family: 'ZCOOL XiaoWei', serif; font-size: 0.75rem;
          padding: 5px 12px; cursor: pointer; transition: all 0.3s; letter-spacing: 0.1em;
          animation: btnFloat 4s ease-in-out infinite alternate;
        }
        .back-btn:hover { border-color: rgba(100,149,237,0.5); color: #a8c4f0; transform: translateY(-2px) !important; }
        .back-btn:disabled { opacity: 0.2; cursor: default; animation: none; }

        .q-text { font-family: 'Ma Shan Zheng', serif; font-size: 1.2rem; color: #c8d8f0; text-align: center; line-height: 1.8; margin-bottom: 32px; min-height: 60px; text-shadow: 0 0 20px rgba(100,149,237,0.2); }

        .options { display: flex; flex-direction: column; gap: 12px; }

        .option-btn {
          padding: 14px 20px;
          background: rgba(8,20,55,0.45);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(100,149,237,0.15); border-radius: 8px;
          color: #8aadda; font-family: 'ZCOOL XiaoWei', serif; font-size: 0.9rem; line-height: 1.6;
          cursor: pointer; text-align: left; transition: all 0.3s; letter-spacing: 0.03em;
          animation: btnFloat var(--opt-dur, 3.8s) var(--opt-del, 0s) ease-in-out infinite alternate;
        }
        .option-btn:nth-child(1) { --opt-dur: 3.8s; --opt-del: 0s; }
        .option-btn:nth-child(2) { --opt-dur: 4.2s; --opt-del: 0.4s; }
        .option-btn:nth-child(3) { --opt-dur: 3.6s; --opt-del: 0.8s; }
        .option-btn:hover { background: rgba(25,55,140,0.45); border-color: rgba(100,149,237,0.45); color: #c8d8f0; transform: translateX(6px) translateY(-2px) !important; box-shadow: 0 4px 20px rgba(60,100,220,0.15); }
        .option-btn.selected { background: rgba(30,65,160,0.5); border-color: rgba(100,149,237,0.6); color: #c8d8f0; }

        .result-section { transition: opacity 0.8s ease, transform 0.8s ease; }
        .result-section.hidden { opacity: 0; transform: translateY(20px); pointer-events: none; }
        .result-section.visible { opacity: 1; transform: translateY(0); }

        .persona-name { font-family: 'Ma Shan Zheng', serif; font-size: 1.5rem; color: #a8c4f0; text-align: center; letter-spacing: 0.15em; line-height: 1.5; text-shadow: 0 0 30px rgba(100,149,237,0.6); margin-bottom: 8px; }
        .persona-label { text-align: center; font-size: 0.75rem; color: #3a5a8a; letter-spacing: 0.3em; margin-bottom: 24px; }
        .radar-wrap { display: flex; justify-content: center; margin: 20px 0; }

        .analysis-block { margin-top: 24px; }
        .analysis-text { color: #8aadda; font-size: 0.9rem; line-height: 2; margin-bottom: 20px; padding: 16px; border-left: 2px solid rgba(100,149,237,0.3); background: rgba(8,20,55,0.35); backdrop-filter: blur(10px); border-radius: 0 8px 8px 0; }
        .trait-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .trait-box { padding: 16px; background: rgba(8,20,55,0.38); backdrop-filter: blur(10px); border: 1px solid rgba(100,149,237,0.1); border-radius: 8px; }
        .trait-title { font-size: 0.75rem; color: #4a7ad4; letter-spacing: 0.2em; margin-bottom: 10px; }
        .trait-item { font-size: 0.82rem; color: #7a9ac0; line-height: 1.8; padding-left: 10px; border-left: 1px solid rgba(100,149,237,0.2); margin-bottom: 8px; }

        .restart-btn {
          display: block; width: 100%; padding: 14px;
          background: rgba(8,20,55,0.35); backdrop-filter: blur(10px);
          border: 1px solid rgba(100,149,237,0.2); border-radius: 8px;
          color: #4a7ad4; font-family: 'Ma Shan Zheng', serif; font-size: 0.9rem; letter-spacing: 0.2em;
          cursor: pointer; transition: all 0.3s; margin-top: 32px;
          animation: btnFloat 4s 0.5s ease-in-out infinite alternate;
        }
        .restart-btn:hover { border-color: rgba(100,149,237,0.4); color: #a8c4f0; transform: translateY(-3px) !important; }

        .intro-desc { color: #5a7ab0; font-size: 0.85rem; line-height: 2.5; text-align: center; margin-bottom: 28px; }
      `}</style>

      <div className="bg" />
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`, top: `${p.top}%`,
          width: `${p.size}px`, height: `${p.size}px`, opacity: p.opacity,
          "--dur": `${p.duration}s`, "--del": `${p.delay}s`,
          "--dx": `${p.driftX}px`, "--dy": `${p.driftY}px`,
        }} />
      ))}

      {bursts.map(b => (
        <StarBurst key={b.id} x={b.x} y={b.y} onDone={() => removeBurst(b.id)} />
      ))}

      <div className="app">
        <div className="card">

          {screen === "intro" && (
            <>
              <div className="title-main">
                <span className="float-text">灵魂坐标</span><span className="float-text-2">测评</span><span className="float-text-3">系统</span>
              </div>
              <div className="subtitle"><span className="float-text-2">· OC 人格深度解析 ·</span></div>
              <div className="divider" />
              <div className="intro-desc">
                <span className="float-text">五十道问题</span><br />
                <span className="float-text-2">穿越表象，触及内核</span><br />
                <span className="float-text-3">探索祂究竟是谁</span>
              </div>
              <div className="pronoun-section">
                <div className="pronoun-label">选择你的 OC 人称</div>
                <div className="pronoun-btns">
                  {pronouns.map(p => (
                    <button key={p} className={`pronoun-btn ${selectedPronoun === p ? "active" : ""}`}
                      onClick={e => { spawnBurst(e); setSelectedPronoun(p); }}>{p}</button>
                  ))}
                </div>
              </div>
              <button className="start-btn" onClick={e => { spawnBurst(e); startMusic(); setScreen("quiz"); }}>
                开始测评
              </button>
            </>
          )}

          {screen === "quiz" && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="q-nav">
                <button className="back-btn" onClick={e => { spawnBurst(e); goBack(); }} disabled={current === 0}>← 上一题</button>
                <div className="q-counter">{String(current + 1).padStart(2, "0")} / {QUESTIONS.length}</div>
                <div style={{ width: 64 }} />
              </div>
              <div className="q-text">{replacePronouns(QUESTIONS[current].text)}</div>
              <div className="options">
                {QUESTIONS[current].options.map((opt, i) => (
                  <button key={i}
                    className={`option-btn ${answers[QUESTIONS[current].id]?.optionIdx === i ? "selected" : ""}`}
                    onClick={e => { spawnBurst(e); handleAnswer(QUESTIONS[current], i); }}>
                    {replacePronouns(opt)}
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === "result" && result && (
            <>
              <div className={`result-section ${revealed.name ? "visible" : "hidden"}`}>
                <div className="persona-label">· 你的 OC 人格是 ·</div>
                <div className="persona-name">{result.personality.name}</div>
                <div className="divider" />
              </div>
              <div className={`result-section ${revealed.radar ? "visible" : "hidden"}`}>
                <div className="radar-wrap"><RadarChart traits={result.traits} /></div>
              </div>
              <div className={`result-section ${revealed.analysis ? "visible" : "hidden"}`}>
                <div className="analysis-block">
                  <div className="analysis-text">{replacePronouns(result.personality.description)}</div>
                  <div className="trait-section">
                    <div className="trait-box">
                      <div className="trait-title">▲ 优势</div>
                      {result.personality.strengths.map((s, i) => <div key={i} className="trait-item">{replacePronouns(s)}</div>)}
                    </div>
                    <div className="trait-box">
                      <div className="trait-title">▽ 劣势</div>
                      {result.personality.weaknesses.map((w, i) => <div key={i} className="trait-item">{replacePronouns(w)}</div>)}
                    </div>
                  </div>
                </div>
                <button className="restart-btn" onClick={e => {
                  spawnBurst(e);
                  setScreen("intro"); setCurrent(0); setAnswers({}); setResult(null);
                  setRevealed({ name: false, radar: false, analysis: false });
                }}>重新测评</button>
              </div>
            </>
          )}

        </div>
      </div>

      <Crow onClick={() => {}} />
    </>
  );
}
