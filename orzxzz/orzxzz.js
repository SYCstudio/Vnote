function orzxzzBeginning()
{
	document.getElementById("mainArea").innerHTML = "\
		<p align=\"center\">																							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(66,133,244)\">O</span>							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(234,67,53)\">r</span>							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(251,188,5)\">z</span>							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(66,133,244)\">x</span>							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(52,168,83)\">z</span>							\
			<span style=\"font-size: 192px; font-weight: bold; color:rgb(234,67,53)\">z</span>							\
		</p>																											\
		<p align=\"center\">																							\
			<span style=\"font-size: 18px; color: #ff3333; text-shadow: 0px 0px 2px rgba(255,255,255,1), 				\
			0px 0px 7px rgba(255,255,255,1), 0px 0px 11px rgba(255,255,255,1)\">										\
				倘使有一双翅膀，我甘愿做人间的飞蛾。<br>																\
			</span>																										\
			<span style=\"font-size: 18px; color: #ff3333; text-shadow: 0px 0px 2px rgba(255,255,255,1), 				\
			0px 0px 7px rgba(255,255,255,1), 0px 0px 11px rgba(255,255,255,1)\">										\
				我要飞向红太阳xzz，让我在眼前一阵光、身内一阵热的当儿，<br>												\
			</span>																										\
			<span style=\"font-size: 18px; color: #ff3333; text-shadow: 0px 0px 2px rgba(255,255,255,1), 				\
			0px 0px 7px rgba(255,255,255,1), 0px 0px 11px rgba(255,255,255,1)\">										\
				失去知觉，而化做一阵烟，一撮灰。<br>																	\
			</span>																										\
		</p>																											\
		<div id=\"orzTablet\" align=\"center\">																			\
			<p align=\"center\">																						\
				<button sytle=\"font-size: 24px; color:#ff0000\" onclick=\"orzxzzAdvanced()\">							\
					我生而为此。																						\
				</button>																								\
			</p>																										\
		</div>																											\
	";
}

function orzxzzAdvanced()
{
	document.title = "orz xzz!";
	document.getElementById("orzTablet").innerHTML = "\
		<img src=\"xzz_p_hexawalk.gif\">																				\
		<p style=\"margin:10px\">																						\
			<span style=\"font-size: 24px; color: #ffffff; text-shadow: 0px 0px 5px rgba(255,255,0,1), 					\
			0px 0px 10px rgba(255,127,0), 0px 0px 18px rgba(255,0,0,1)\">												\
				赞美太阳！<br>																							\
				xzz 是我们的红太阳！<br>																				\
				让我们膜拜红太阳！<br>																					\
			</span>																										\
		</p>																											\
		<button style=\"font-size: 24px\" onclick=\"orzxzzMain()\" id=\"orzMainButton\">								\
			膜拜！																										\
		</button>																										\
		<div style=\"font-size: 30px; background: rgba(255,255,255,0.7); width: auto\" id=\"orzTimes\"></div>			\
		<div style=\"font-size: 20px; background: rgba(0,0,255,0.7); color: white\" id=\"orzButtonClickTimes\"></div>	\
		<div style=\"font-size: 30px; background: rgba(0,0,0,0.7); color: white;										\
			font-weight: bold;\" id=\"xzzTextsDialog\">																	\
		</div>																											\
		";
}

var orzTimesCnt = 0;
var orzTimesDelta = 1;

var xzzAna = new Array(
	"你个菜逼我今天AK了",
	"NOI怎么这么水啊，这不是用来随手AK的吗",
	"你怎么还在乱膜啊？？？你快吸掉我RP的0.000000001‰了",
	"今天考试又是三个傻逼题，我不仅AK了还把2048玩到了2^1000000",
	"怎么我出的题全场爆零啊，我以为会有人负分的啊",
	"你们还是naive，我怎么可能不AK？",
	"今天题真的水，你们不AK的都退役吧"
);

var orzStayTag = 0;
var orzButtonClicked = 0;

function orzxzzMain()
{
	orzTimesCnt += orzTimesDelta;
	orzButtonClicked ++;
	document.getElementById("orzTimes").innerHTML = "你已经 Orz xzz 了 " + orzTimesCnt + " 次。";

	if(orzTimesCnt < 100)orzTimesDelta = 1;
	else if(orzTimesCnt < 1000)orzTimesDelta = Math.min(1000 - orzTimesCnt, Math.floor(Math.random() * 16 + 1));
	else if(orzTimesCnt < 10000)orzTimesDelta = Math.min(10000 - orzTimesCnt, Math.floor(Math.random() * 128 + 1));
	else if(orzTimesCnt < 65533)orzTimesDelta = Math.min(65533 - orzTimesCnt, Math.floor(Math.random() * 512 + 1));
	else orzTimesDelta = 1;

	document.getElementById("orzButtonClickTimes").innerHTML = "（你已经点击了这个按钮 " + orzButtonClicked + " 次。）";

	document.getElementById("orzMainButton").innerHTML = "继续膜拜 " + orzTimesDelta + " 次";

	if(orzTimesCnt >= 1)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『诶，又有一个来膜拜我的，来吧来吧继续膜』";
		if(orzTimesCnt == 1)orzStayTag = 1;
	}
	if(orzTimesCnt >= 2)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『你们还是naive，我又AK了』";
		if(orzTimesCnt == 2)orzStayTag = 5;
	}
	if(orzTimesCnt >= 10)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『虽然我是大佬，但是你这样一直膜我是会掉RP的。』";
		if(orzTimesCnt == 10)orzStayTag = 5;
	}
	if(orzTimesCnt >= 20)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『MDZZ，你怎么还在膜？信不信我从5楼天降正义！』";
		if(orzTimesCnt == 20)orzStayTag = 10;
	}
	if(orzTimesCnt >= 50)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『没错，我就是这么强！让你好好膜！』";
		if(orzTimesCnt == 50)orzStayTag = 30;
	}
	if(orzTimesCnt >= 100)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『你真棒，我感受到我又变强了。我允许你一次多膜一点！』";
		if(orzTimesCnt == 100)orzStayTag = 30;
	}
	if(orzTimesCnt >= 1000)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『我已经感受到了源源不断的大佬之力量！』";
		if(orzTimesCnt == 1000)orzStayTag = 50;
	}
	if(orzTimesCnt >= 10000)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『所有人都将被我的强大所征服！』";
		if(orzTimesCnt == 10000)orzStayTag = 50;
	}
	if(orzTimesCnt >= 65533)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『你这个辣鸡，怎么天天膜我？』";
		orzStayTag = 2147483647;
	}
	if(orzTimesCnt >= 65534)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "xzz『既然这样的话，那就让我展示一下如何吊打你！』";
		orzStayTag = 2147483647;
	}
	if(orzTimesCnt >= 65535)
	{
		document.getElementById("mainArea").innerHTML = "\
			<h1 style=\"color:red\" align=\"center\">																	\
				xzz『你真的还敢再膜一下吗？』																			\
			</h1>																										\
			<img src=\"xzz_repent.jpg\">																				\
			<br>																										\
			<button sytle=\"font-size: 24px;color:#ff0000\" onclick=\"orzxzzLast1()\">									\
				我生而为此。																							\
			</button>																									\
			";
		orzStayTag = 2147483647;
	}

	orzStayTag--;
	if(orzStayTag <= 0)
	{
		document.getElementById("xzzTextsDialog").innerHTML = "（你继续膜拜了 xzz 。）";
	}
}

function orzxzzLast1()
{
	document.getElementById("mainArea").innerHTML = "\
		<h1 style=\"color:white; background: rgba(0,0,0,0.7)\">															\
			* xzz 使用了 滚动！<br>																						\
			* 效果绝佳！<br>																							\
			* 你 倒下了！<br>																							\
			xzz『你怎么回事小老弟？？？』																				\
		</h1>																											\
		<br>																											\
		<img src=\"xzz_glance.jpg\">																					\
		<br>																											\
		<button style=\"font-size: 24px; color:#000000\" onclick=\"orzxzzLast2()\">										\
			确认																										\
		</button>																										\
		";
}

function orzxzzLast2()
{
	document.getElementById("mainArea").innerHTML = "\
		<h1 style=\"color:white; background: rgba(0,0,0,0.7)\">															\
			被秒乃蒟蒻常事<br>																							\
			蒟蒻重新来过吧<br>																							\
		</h1>																											\
		<br>																											\
		<img src=\"xzz_kicksphereEX.gif\">																				\
		<br>																											\
		<span style=\"font-size: 12px; color:#666666\">																	\
			即使是 zsy 也改变不了被 xzz 秒掉的命运																		\
		</span>																											\
		<br>																											\
		<button style=\"font-size: 24px; color:#000000\" onclick=\"javascript:location.reload();\">						\
			继续 orz xzz！																								\
		</button>																										\
		";
}
