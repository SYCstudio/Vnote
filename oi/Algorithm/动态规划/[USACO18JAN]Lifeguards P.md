# [USACO18JAN]Lifeguards P
[BZOJ5185 Luogu4182]

农夫约翰为他的奶牛们开了一个游泳池，他认为这将有助于他们放松和生产更多的牛奶。为确保安全，他请了N只牛做救生员，每只牛都有一个工作时间，为一些连续的时间间隔为了简单起见，泳池每天从时间0打开到到10^9，所以每个区间都可以用两个整数来描述，给定的这两个整数就是区间的开始和结束时刻。例如，一个救生员从t = 4时开始工作和在t=7时结束，共覆盖三个时间单位（注意端点也是覆盖到的时间点）。但不幸的是，农夫约翰雇佣了比它支付能力多出K个的救生员。他需要开除正好K个救生员，求出剩余的救生员最大能够覆盖多长的时间（一段时间被覆盖当且仅当这时有至少一个救生员在工作）

首先被其它区间包含的区间一定是可以不选的，一开始可以把这些区间去掉。然后将区间按照右端点排序，由于没有包含的情况，左右端点此时都是单调的了。题目中要求选 K 个移出，其实是至少 K 个，因为多移出一些答案不会更好。所以设 F[i][j] 表示前 i 个区间，至少移出了 j 个的最大覆盖时间。转移分三种考虑，一种是当前第 i 个区间不选，则由  F[i-1][j-1] 转移过来；第二种是当前区间选，并且与前面区间有交，那么就找到与当前区间有交且最靠左的区间，从这里转移过来；第三种是与当前区间选且与前面区间不交，则从有交且最靠左的前一个区间转移过来。  
与当前区间有交且最靠左的区间是单调的，可以用一个单调指针来维护。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxK=110;
const int inf=2147483647;

class Range
{
public:
	int l,r;
};

int n,K;
Range Rg[maxN],R[maxN];
int F[maxN][maxK];

bool cmp1(Range A,Range B);
bool cmp2(Range A,Range B);

int main(){
	//freopen("in.in","r",stdin);
	scanf("%d%d",&n,&K);
	for (int i=1;i<=n;i++) scanf("%d%d",&Rg[i].l,&Rg[i].r);
	sort(&Rg[1],&Rg[n+1],cmp1);
	int rcnt=0;
	for (int i=1,nowr=0;i<=n;i++)
		if (Rg[i].r>nowr) R[++rcnt]=Rg[i],nowr=Rg[i].r;
		else K--;

	K=max(K,0);
	n=rcnt;
	sort(&R[1],&R[n+1],cmp2);

	mem(F,128);
	F[0][0]=0;
	for (int i=1,p=1;i<=n;i++){
		while ((p<=i)&&(R[p].r<R[i].l)) p++;
		for (int j=0;j<=K;j++){
			if (j!=0) F[i][j]=max(F[i][j],F[i-1][j-1]);
			if (j==K) F[i][j]=max(F[i][j],F[i-1][j]);
			if (i!=p) F[i][min(j+(i-p-1),K)]=max(F[i][min(j+(i-p-1),K)],F[p][j]+R[i].r-R[p].r);
			F[i][min(j+(i-p-1)+1,K)]=max(F[i][min(j+(i-p-1)+1,K)],F[p-1][j]+R[i].r-R[i].l);
		}
	}
	
	printf("%d\n",F[n][K]);return 0;
}

bool cmp1(Range A,Range B){
	if (A.l!=B.l) return A.l<B.l;
	else return A.r>B.r;
}

bool cmp2(Range A,Range B){
	return A.l<B.l;
}
```