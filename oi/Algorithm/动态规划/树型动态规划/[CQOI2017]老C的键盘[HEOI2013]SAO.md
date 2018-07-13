# [CQOI2017]老C的键盘
[BZOJ4824 Luogu3757]

老C是个程序员。  
作为一个优秀的程序员，老C拥有一个别具一格的键盘，据说这样可以大幅提升写程序的速度，还能让写出来的程序在某种神奇力量的驱使之下跑得非常快。  
小Q也是一个程序员。有一天他悄悄潜入了老C的家中，想要看看这个键盘究竟有何妙处。他发现，这个键盘共有n个按键，这n个按键虽然整齐的排成一列，但是每个键的高度却互不相同。聪明的小Q马上将每个键的高度用1~n的整数表示了出来，得到一个1~n的排列 $h_1,h_2,...,h_n$ 。  
为了回去之后可以仿造一个新键盘（新键盘每个键的高度也是一个1~n的排列），又不要和老C的键盘完全一样，小Q决定记录下若干对按键的高度关系。作为一个程序员，小Q当然不会随便选几对就记下来，而是选了非常有规律的一些按键对：对于 $i=2,3,...,n$ ，小Q都记录下了一个字符&lt;或者&gt;，表示 $h\_{i/2}&lt;h_i$ 或者 $h\_{i/2}&gt;h_i$ 。于是，小Q得到了一个长度为n-1的字符串，开开心心的回家了。  
现在，小Q想知道满足他所记录的高度关系的键盘有多少个。虽然小Q不希望自己的键盘和老C的完全相同，但是完全相同也算一个满足要求的键盘。答案可能很大，你只需要告诉小Q答案mod 1,000,000,007之后的结果即可。

# [HEOI2013]SAO
[BZOJ3167 Luogu4099]

Welcome to SAO ( Strange and Abnormal Online)。这是一个 VR MMORPG， 含有 n 个关卡。但是，挑战不同关卡的顺序是一个很大的问题。  
有 n – 1 个对于挑战关卡的限制，诸如第 i 个关卡必须在第 j 个关卡前挑战， 或者完成了第 k 个关卡才能挑战第 l 个关卡。并且，如果不考虑限制的方向性， 那么在这 n – 1 个限制的情况下，任何两个关卡都存在某种程度的关联性。即， 我们不能把所有关卡分成两个非空且不相交的子集，使得这两个子集之间没有任何限制。

设$F[x][i]$表示点$x$在其子树中排名为$i$的方案数。首先递归$x$的所有子树，得到儿子的$y$答案。然后考虑如何合并。  
首先对于$x<y$的情况，为了以示区分，设$g[i]$表示新的答案。另外设$S[i]$表示$i$的大小，$pre[x][],suf[x][]$分别表示$f[x][]$的前缀和和后缀和。枚举$i$表示新的$x$前面有$i$个来自于原来$x$的部分，枚举$j$表示前面有$j-1$个来自于子树$y$的部分，这样就可以保证$y$的编号一定在$x$的后面，考虑$x$前后的组合意义，可以得到式子  
$g[i+j-1]+=C\_{i+j-2}^{i-1} C\_{S[x]+S[y]-(i+j-2)-1}^{S[x]-i}f[x][i]suf[y][j]$

类似地，对于$x>y$的情况，枚举$i$表示$x$前面有$i$个来自于原来的$x$部分，枚举$j$表示前面有$j$个来自于$y$部分，这样就可以保证$y$在$x$的前面出现，根据组合意义，得到  
$g[i+j]+=C\_{i+j-1}^{i-1} C\_{S[x]+S[y]-(i+j-1)-1}^{S[x]-i}f[x][i]pre[y][j]$

分别转移。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101;
const int Mod=1e9+7;
const int inf=2147483647;

int n;
char Input[maxN];
int edgecnt,Head[maxN],Next[maxN],V[maxN],Opt[maxN];
int C[maxN][maxN];
int Size[maxN],F[maxN][maxN],G[maxN],Pre[maxN][maxN],Suf[maxN][maxN];

void Add_Edge(int u,int v,int w);
void dfs(int u);

int main()
{
	mem(Head,-1);
	scanf("%d",&n);
	scanf("%s",Input+2);
	for (int i=2;i<=n;i++)
		if (Input[i]=='<') Add_Edge(i/2,i,1);
		else Add_Edge(i/2,i,2);

	C[0][0]=1;
	for (int i=1;i<=n;i++)
	{
		C[i][0]=1;
		for (int j=1;j<=i;j++) C[i][j]=(C[i-1][j]+C[i-1][j-1])%Mod;
	}

	dfs(1);
	int Ans=0;
	for (int i=1;i<=n;i++) Ans=(Ans+F[1][i])%Mod;
	printf("%d\n",Ans);
	return 0;
}

void Add_Edge(int u,int v,int w){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;Opt[edgecnt]=w;
	return;
}

void dfs(int u)
{
	Size[u]=1;F[u][1]=1;
	for (int e=Head[u];e!=-1;e=Next[e])
	{
		dfs(V[e]);
		for (int i=1;i<=Size[u];i++)
			for (int j=1;j<=Size[V[e]];j++)
				if (Opt[e]==1)
					G[i+j-1]=(G[i+j-1]+1ll*C[i+j-2][i-1]*C[Size[u]+Size[V[e]]-(i+j-1)][Size[u]-i]%Mod*F[u][i]%Mod*Suf[V[e]][j]%Mod)%Mod;
				else
					G[i+j]=(G[i+j]+1ll*C[i+j-1][i-1]*C[Size[u]+Size[V[e]]-i-j][Size[u]-i]%Mod*F[u][i]%Mod*Pre[V[e]][j]%Mod)%Mod;
		Size[u]+=Size[V[e]];
		for (int i=1;i<=Size[u];i++) F[u][i]=G[i],G[i]=0;
	}
	for (int i=1;i<=Size[u];i++) Pre[u][i]=(Pre[u][i-1]+F[u][i])%Mod;
	for (int i=Size[u];i>=1;i--) Suf[u][i]=(Suf[u][i+1]+F[u][i])%Mod;
	return;
}
```

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010;
const int maxM=maxN<<1;
const int Mod=1e9+7;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],W[maxM];
int F[maxN][maxN],G[maxN],Size[maxN],Pre[maxN][maxN],Suf[maxN][maxN];
int C[maxN][maxN];

void Add_Edge(int u,int v,int w);
void dfs(int u,int fa);

int main()
{
	int TTT;scanf("%d",&TTT);

	C[0][0]=1;
	for (int i=1;i<maxN;i++)
	{
		C[i][0]=1;
		for (int j=1;j<=i;j++) C[i][j]=(C[i-1][j]+C[i-1][j-1])%Mod;
	}
	
	while (TTT--)
	{
		edgecnt=0;mem(Head,-1);mem(F,0);mem(Size,0);mem(G,0);mem(Pre,0);mem(Suf,0);
		scanf("%d",&n);
		for (int i=1;i<n;i++)
		{
			int u,v;char ch;scanf("%d %c %d",&u,&ch,&v);u++;v++;
			Add_Edge(u,v,ch=='>');
			Add_Edge(v,u,ch=='<');
		}
		dfs(1,0);

		printf("%d\n",Pre[1][n]);
	}

	return 0;
}

void Add_Edge(int u,int v,int w){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
	return;
}

void dfs(int u,int fa){
	Size[u]=1;F[u][1]=1;
	for (int e=Head[u];e!=-1;e=Next[e])
		if (V[e]!=fa)
		{
			dfs(V[e],u);
			for (int i=1;i<=Size[u];i++)
				for (int j=1;j<=Size[V[e]];j++)
					if (W[e]==0)
						G[i+j-1]=(G[i+j-1]+1ll*C[i+j-2][i-1]*C[Size[u]+Size[V[e]]-i-j+1][Size[u]-i]%Mod*F[u][i]%Mod*Suf[V[e]][j]%Mod)%Mod;
					else
						G[i+j]=(G[i+j]+1ll*C[i+j-1][i-1]*C[Size[u]+Size[V[e]]-i-j][Size[u]-i]%Mod*F[u][i]%Mod*Pre[V[e]][j]%Mod)%Mod;
			Size[u]+=Size[V[e]];
			for (int i=1;i<=Size[u];i++) F[u][i]=G[i],G[i]=0;
		}
	for (int i=1;i<=Size[u];i++) Pre[u][i]=(Pre[u][i-1]+F[u][i])%Mod;
	for (int i=Size[u];i>=1;i--) Suf[u][i]=(Suf[u][i+1]+F[u][i])%Mod;
	return;
}
```