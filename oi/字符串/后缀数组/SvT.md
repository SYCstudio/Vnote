# SvT
[BZOJ3879]

(我并不想告诉你题目名字是什么鬼)  
有一个长度为n的仅包含小写字母的字符串S,下标范围为[1,n].  
现在有若干组询问,对于每一个询问,我们给出若干个后缀(以其在S中出现的起始位置来表示),求这些后缀两两之间的LCP (LongestCommonPrefix) 的长度之和.一对后缀之间的LCP长度仅统计一遍.

后缀数组，转化为统计每两个字典序相邻后缀之间的$Height$的贡献值，那么用单调队列处理处前后能够跨越的区间，然后枚举计数。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=505000;
const int maxBit=20;
const ll Mod=23333333333333333;
const int inf=2147483647;

int n,m;
char str[maxN];
int A[maxN],B[maxN],CntA[maxN],CntB[maxN];
int SA[maxN],SSA[maxN],Rank[maxN],Height[maxBit][maxN];
int Seq[maxN],Log2[maxN],Ht[maxN],L[maxN],R[maxN],Q[maxN];

int LCP(int p1,int p2);

int main()
{
	for (int i=1;i<maxN;i++) Log2[i]=log2(i);
	scanf("%d%d",&n,&m);
	scanf("%s",str+1);
	
	for (int i=1;i<=n;i++) CntA[str[i]-'a']++;
	for (int i=1;i<=26;i++) CntA[i]+=CntA[i-1];
	for (int i=n;i>=1;i--) SA[CntA[str[i]-'a']--]=i;
	Rank[SA[1]]=1;
	for (int i=2;i<=n;i++){
		Rank[SA[i]]=Rank[SA[i-1]];
		if (str[SA[i]]!=str[SA[i-1]]) Rank[SA[i]]++;
	}
	for (int i=1;Rank[SA[n]]!=n;i<<=1){
		mem(CntA,0);mem(CntB,0);
		for (int j=1;j<=n;j++){
			CntA[A[j]=Rank[j]]++;
			CntB[B[j]=(i+j<=n)?(Rank[i+j]):(0)]++;
		}
		for (int j=1;j<maxN;j++) CntA[j]+=CntA[j-1],CntB[j]+=CntB[j-1];
		for (int j=n;j>=1;j--) SSA[CntB[B[j]]--]=j;
		for (int j=n;j>=1;j--) SA[CntA[A[SSA[j]]]--]=SSA[j];
		Rank[SA[1]]=1;
		for (int j=2;j<=n;j++){
			Rank[SA[j]]=Rank[SA[j-1]];
			if ((A[SA[j]]!=A[SA[j-1]])||(B[SA[j]]!=B[SA[j-1]])) Rank[SA[j]]++;
		}
	}
	for (int i=1,j=0;i<=n;i++){
		while (str[i+j]==str[SA[Rank[i]-1]+j]) j++;
		Height[0][Rank[i]]=j;
		if (j) j--;
	}

	for (int i=1;i<maxBit;i++)
		for (int j=1;j+(1<<(i-1))<=n;j++)
			Height[i][j]=min(Height[i-1][j],Height[i-1][j+(1<<(i-1))]);

	while (m--){
		int cnt;scanf("%d",&cnt);
		for (int i=1;i<=cnt;i++){
			int p;scanf("%d",&p);Seq[i]=Rank[p];
		}
		sort(&Seq[1],&Seq[cnt+1]);cnt=unique(&Seq[1],&Seq[cnt+1])-Seq-1;
		for (int i=1;i<cnt;i++) Ht[i]=LCP(Seq[i],Seq[i+1]);

		int top=0;Q[0]=0;
		for (int i=1;i<cnt;i++){
			while ((top)&&(Ht[Q[top]]>=Ht[i])) top--;
			L[i]=Q[top]+1;Q[++top]=i;
		}
		top=0;Q[0]=cnt;
		for (int i=cnt-1;i>=1;i--){
			while ((top)&&(Ht[Q[top]]>Ht[i])) top--;
			R[i]=Q[top];Q[++top]=i;
		}

		ll Ans=0;
		for (int i=1;i<cnt;i++) Ans=(Ans+1ll*Ht[i]*(i-L[i]+1)%Mod*(R[i]-i)%Mod)%Mod;

		printf("%lld\n",Ans);
	}
	return 0;
}

int LCP(int p1,int p2){
	if (p1>p2) swap(p1,p2);
	int len=p2-p1;
	int lg=Log2[len];
	return min(Height[lg][p1+1],Height[lg][p2-(1<<lg)+1]);
}
```