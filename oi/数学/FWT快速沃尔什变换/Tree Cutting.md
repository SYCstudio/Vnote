# Tree Cutting
[HDU5909]

Byteasar has a tree T with n vertices conveniently labeled with 1,2,...,n. Each vertex of the tree has an integer value vi.  
The value of a non-empty tree T is equal to v1⊕v2⊕...⊕vn, where ⊕ denotes bitwise-xor.  
Now for every integer k from [0,m), please calculate the number of non-empty subtree of T which value are equal to k.  
A subtree of T is a subgraph of T that is also a tree. 

以前用点分治+$DP$的方式做的，如果用$FWT$的话更加直观。设$F[i][j]$表示以$i$为根的子树异或和为$j$的方案数，可以发现从子树转移过来就是一个异或卷积。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1040;
const int maxM=maxN<<1;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,N,inv2;
int Val[maxN];
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int F[maxN][maxN],Ans[maxN],G[maxN];

int QPow(int x,int cnt);
void Add_Edge(int u,int v);
void dfs(int u,int fa);
void FWT(int *P,int N,int opt);

int main()
{
	int TTT;scanf("%d",&TTT);
	inv2=QPow(2,Mod-2);
	while (TTT--)
	{
		edgecnt=0;mem(Head,-1);mem(F,0);mem(Ans,0);
		scanf("%d%d",&n,&m);
		for (N=1;N<m;N<<=1);
		for (int i=1;i<=n;i++) scanf("%d",&Val[i]);
		for (int i=1;i<n;i++)
		{
			int u,v;scanf("%d%d",&u,&v);
			Add_Edge(u,v);Add_Edge(v,u);
		}
		dfs(1,0);

		for (int i=1;i<=n;i++)
			for (int j=0;j<m;j++)
				Ans[j]=(Ans[j]+F[i][j])%Mod;

		for (int i=0;i<m;i++){
			printf("%d",Ans[i]);
			if (i!=m-1) printf(" ");
			else printf("\n");
		}
	}

	return 0;
}

int QPow(int x,int cnt){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%Mod;
		x=1ll*x*x%Mod;cnt>>=1;
	}
	return ret;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs(int u,int fa)
{
	F[u][Val[u]]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa)
		{
			dfs(V[i],u);
			for (int j=0;j<N;j++) G[j]=F[u][j];
			FWT(G,N,1);FWT(F[V[i]],N,1);
			for (int j=0;j<N;j++) G[j]=1ll*G[j]*F[V[i]][j]%Mod;
			FWT(G,N,-1);FWT(F[V[i]],N,-1);
			for (int j=0;j<N;j++) F[u][j]=(F[u][j]+G[j])%Mod;
		}
	return;
}

void FWT(int *P,int N,int opt)
{
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j+=(i<<1))
			for (int k=0;k<i;k++)
			{
				int X=P[j+k],Y=P[j+k+i];
				P[j+k]=(X+Y)%Mod;P[j+k+i]=(X-Y+Mod)%Mod;
				if (opt==-1) P[j+k]=1ll*P[j+k]*inv2%Mod,P[j+k+i]=1ll*P[j+k+i]*inv2%Mod;
			}
	return;
}
```