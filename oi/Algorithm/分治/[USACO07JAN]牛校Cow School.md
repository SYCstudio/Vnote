# [USACO07JAN]牛校Cow School
[BZOJ1701 Luogu2877]

Bessy is going to school and doing well. She has taken N (1 ≤ N ≤ 5000 -- except one case where 1 ≤ N ≤ 50,000) tests and recorded the scores (Ti points out of Pi points for test i; 0 ≤ Ti ≤ Pi < 40,000; 0 < Pi) as this task's input.  
Her teacher will drop the D tests with the lowest percentage (Ti⁄Pi) before calculating Bessie's final grade (which is the sum of the remaining test score points over the sum of the remaining total test points). Bessy is good at math and quickly realizes that this does not benefit her as much as it might.  
To prove her point, Bessy wants to find all values of D for which she could have ended up with a higher grade by choosing to drop different tests than the teacher would have. Help her by finding and printing all values of D for which this is possible.  
Bessy has noted that, amazingly, she has never scored the same percentage on two different tests.  
一个人参加了N场考试，第i场满分为P[i]，其得分为T[i]。现在要删去其中D次考试的成绩，用剩下的总得分除以剩下的满分之和，作为其最终成绩。问对于哪些D而言，删除得分比(即T[i]/P[i])最小的D场得到的最终成绩不是最优的(用其他方法可以得到更高的最终成绩)。

将成绩按照 T/P 排序后，从前往后扫描就可以得到老师留下 i 次考试时的成绩，记为 $\frac{\sum T}{\sum P}$ ，如果另一种方案更优，一定是存在 $i \in [1,i] , j \in [i+1,n]$ 使得 $\frac{\sum T-ti+tj}{\sum P-pi+pj}>\frac{\sum T}{\sum P}$ ，化简后得到 $ti\sum P-pi \sum T < tj \sum P-tj \sum T$ ，所以现在的任务变成对于每一个 i ，求左边的 $ti\sum P-pi \sum T$ 的最小值和右边的 $tj \sum P-tj \sum T$ 的最大值。这个具有决策单调，分治两边来做。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50100;
const int inf=2147483647;
const ll INF=1e18;

class Score
{
public:
	ll t,p;
};

int n;
Score S[maxN];
ll F[maxN],G[maxN],SumT[maxN],SumP[maxN];
int anscnt=0,Ans[maxN];

void SolveF(int l,int r,int sl,int sr);
void SolveG(int l,int r,int sl,int sr);
bool cmp(Score A,Score B);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%lld%lld",&S[i].t,&S[i].p);
	sort(&S[1],&S[n+1],cmp);
	for (int i=1;i<=n;i++) SumT[i]=SumT[i-1]+S[i].t,SumP[i]=SumP[i-1]+S[i].p;
	SolveF(1,n-1,1,n);SolveG(1,n-1,1,n);
	for (int i=n;i>=1;i--) if (F[i]<G[i]) Ans[++anscnt]=n-i;
	printf("%d\n",anscnt);
	for (int i=1;i<=anscnt;i++) printf("%d\n",Ans[i]);
	return 0;
}

void SolveF(int l,int r,int sl,int sr){
	if (l>r) return;
	int mid=(l+r)>>1,pos=sl;
	F[mid]=INF;
	for (int i=sl;i<=min(sr,mid);i++){
		ll t=SumP[mid]*S[i].t-SumT[mid]*S[i].p;
		if (t<F[mid]) F[mid]=t,pos=i;
	}
	SolveF(l,mid-1,sl,pos);SolveF(mid+1,r,pos,sr);
}

void SolveG(int l,int r,int sl,int sr){
	if (l>r) return;
	int mid=(l+r)>>1,pos=sl;
	G[mid]=-INF;
	for (int i=sr;(i>mid)&&(i>=sl);i--){
		ll t=SumP[mid]*S[i].t-SumT[mid]*S[i].p;
		if (t>G[mid]) G[mid]=t,pos=i;
	}
	SolveG(l,mid-1,sl,pos);SolveG(mid+1,r,pos,sr);return;
}

bool cmp(Score A,Score B){
	return A.t*B.p>A.p*B.t;
}
```