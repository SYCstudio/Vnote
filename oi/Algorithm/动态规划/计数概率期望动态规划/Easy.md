# Easy
[BZOJ3450]

某一天WJMZBMR在打osu~~~但是他太弱逼了，有些地方完全靠运气:(  
我们来简化一下这个游戏的规则  
有n次点击要做，成功了就是o，失败了就是x，分数是按comb计算的，连续a个comb就有a * a分，comb就是极大的连续o。  
比如ooxxxxooooxxx，分数就是2 * 2+4 * 4=4+16=20。  
Sevenkplus闲的慌就看他打了一盘，有些地方跟运气无关要么是o要么是x，有些地方o或者x各有50%的可能性，用?号来表示。  
比如oo?xx就是一个可能的输入。  
那么WJMZBMR这场osu的期望得分是多少呢？  
比如oo?xx的话，?是o的话就是oooxx => 9，是x的话就是ooxxx => 4  
期望自然就是(4+9)/2 =6.5了

在前后分别补充一个 x ，那么把所有的贡献都在 x 的地方算进答案。首先可以想到一个 $O(n^2)$ 的 DP ，只有当当前是 ? 或者是 x 的时候才进行，设 F[i] 表示到 i 且 i 为结束位置时的期望得分，那么往前枚举直到遇到第一个 x ，每到一个 ? 概率就除二。  
然后考虑这个式子的实质是什么，即 $F[i]=\sum \frac{F[j]+(i-j-1)^2}{2^k}$ ，其中 k 表示从 i 到 j 中间经过了多少个 ? 说明需要除以多少个 2 。拆开它，得到 $F[i]=\sum \frac{F[j]}{2^k}+(i-1)^2\sum\frac{1}{2^k}-2(i-1)\sum\frac{j}{2^k}+\sum\frac{j^2}{2^k}$ ，分别用四个变量来维护，每碰到一个 ? 就分别加上对应的贡献并除以二，每碰到一个 x 就清空之前的累加。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=301000;
const int inf=2147483647;

int n;
char Input[maxN];
ld F[maxN];

int main(){
	scanf("%d",&n);scanf("%s",Input+1);Input[0]=Input[++n]='x';
	mem(F,0);ld s1=0,s2=1,s3=0,s4=0;
	for (int i=1;i<=n;i++)
		if (Input[i]=='?'){
			F[i]=s1+s2*(ld)(i-1)*(ld)(i-1)-(ld)2.0*(ld)(i-1)*s3+s4;
			s1=(s1+F[i])*0.5;s2=(s2+(ld)1.0)*0.5;s3=(s3+(ld)i)*0.5;s4=(s4+(ld)i*(ld)i)*0.5;
		}
		else if (Input[i]=='x'){
			F[i]=s1+s2*(ld)(i-1)*(ld)(i-1)-(ld)2.0*(i-1)*s3+s4;
			s1=F[i];s2=1;s3=i;s4=(ld)i*(ld)i;
		}
	printf("%.4LF\n",F[n]);return 0;
}
```