# Permutation Graph
[ZOJ3874]

Edward has a permutation {a1, a2, … an}. He finds that if he connects each pair (ai, aj) such that i < j and ai > aj, he will get a graph.  
For example, if the permutation is {2, 3, 1, 4}, then 1 and 2 are connected and 1 and 3 are connected.  
Edward lost his permutation, but he does know the connected components of the corresponding graph. He wants to know how many permutations will result in the same connected components.  
Note that two vertices u, v belong to the same connected component if there exists a sequence of vertices starting with u and ending with v such that every two subsequent vertices in the sequence are connected by an edge.

若对于一个排列，若有$i<j$且$a _ i > a _ j$，则连接$a _ i,a _ j$。这样可以构成若干连通块。现在给出连通块的个数，和各个连通块内分别有哪些数。求有多少可行的排列数。

首先要知道一个题目的性质，就是一个连通块内的数值一定是连续的，因为假设中间断开了一个，那么这个如果在前面，比它小的在它后面就可以形成一对逆序；在后面，比它大的也可以形成逆序。另外，既然确定了每一个连通块都是连续的，那么连通块在排列中的顺序也是确定的，因为前一个连通快的最大值一定小于后一个连通块的最小值。那么这样一来，答案就只与每一个连通块的长度有关了。  
怎么算答案呢？设$F[i]$表示长度为$i$的连通块的方案数。考虑用总方案-不合法的方案的方法，则有$F[i]=i!-j! \times F[i-j]$，意义是前$j$个数的任意排列拼接上后$i-j$个数的不合法的方案，一定是不合法的。而这样保证了左边全部都是全互不连通的单块，且左右不连通，这样就可以不重不漏了。  
发现这是一个卷积的形式，由于要预处理每一种长度的答案，所以用分治+$FFT$的方式。由于模数是费马质数，所以可以用$NTT$。  
另外需要注意的是，由于在分治$NTT$中需要多次调用各类数值计算，所以需要预处理排列、逆元和单位根以加快速度。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000*4;
const int Mod=786433;
const int G=10;
const int inf=2147483647;

int Rader[maxN];
int F[maxN],Fac[maxN];
int P1[maxN],P2[maxN];
int W1[maxN],W2[maxN],Inv[maxN];

int QPow(int x,int cnt);
void Divide(int l,int r);
void NTT(int *P,int N,int opt);

int main()
{
	Fac[0]=1;for (int i=1;i<maxN;i++) Fac[i]=1ll*Fac[i-1]*(ll)i%Mod;
	F[0]=1;
	for (int i=1;i<maxN;i<<=1) W1[i]=QPow(G,(Mod-1)/i),W2[i]=QPow(W1[i],Mod-2),Inv[i]=QPow(i,Mod-2);
	Divide(1,100000);
	//for (int i=1;i<=10;i++) cout<<F[i]<<" ";cout<<endl;

	int TTT;scanf("%d",&TTT);
	while (TTT--)
	{
		int n,m;scanf("%d%d",&n,&m);
		bool flag=1;
		int Ans=1;
		for (int i=1;i<=m;i++)
		{
			int k,mn=inf,mx=0;
			scanf("%d",&k);
			for (int j=1;j<=k;j++)
			{
				int num;scanf("%d",&num);
				mn=min(mn,num);mx=max(mx,num);
			}
			if (mx-mn+1!=k) flag=0;
			Ans=1ll*Ans*F[k]%Mod;
		}
		if (flag) printf("%d\n",Ans);
		else printf("0\n");
	}
	return 0;
}

int QPow(int x,int cnt)
{
	int Ret=1;
	while (cnt){
		if (cnt&1) Ret=1ll*Ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return Ret;
}

void Divide(int l,int r)
{
	if (l==r){
		F[l]=(Fac[l]-F[l]+Mod)%Mod;return;
	}
	int mid=(l+r)>>1;
	Divide(l,mid);

	int sz=r-l+1,lsz=mid-l+1,rsz=r-(mid+1)+1;
	
	int N,L=0;
	for (N=1;N<=sz+sz;N<<=1) L++;
	for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));

	for (int i=0;i<N;i++) P1[i]=P2[i]=0;
	for (int i=l;i<=mid;i++) P1[i-l+1]=F[i];
	for (int i=1;i<sz;i++) P2[i]=Fac[i];

	NTT(P1,N,1);NTT(P2,N,1);
	for (int i=0;i<N;i++) P1[i]=1ll*P1[i]*P2[i]%Mod;
	NTT(P1,N,-1);

	for (int i=mid+1;i<=r;i++) F[i]=(F[i]+P1[i-l+1])%Mod;
	Divide(mid+1,r);
	return;
}

void NTT(int *P,int N,int opt)
{
	for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<N;i<<=1)
	{
		int l=i<<1;
		int dw=(opt==1)?(W1[l]):(W2[l]);
		for (int j=0;j<N;j+=l)
		{
			int w=1;
			for (int k=0;k<i;k++,w=1ll*w*dw%Mod)
			{
				int X=P[j+k],Y=1ll*P[j+k+i]*w%Mod;
				P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
			}
		}
	}
	if (opt==-1)
	{
		int inv=Inv[N];
		for (int i=0;i<N;i++) P[i]=1ll*P[i]*inv%Mod;
	}
	return;
}
```
