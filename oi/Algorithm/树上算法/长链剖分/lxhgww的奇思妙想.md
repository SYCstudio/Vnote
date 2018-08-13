# lxhgww的奇思妙想
[VIJOS Bashu_OIers-5a79a3e1d3d8a103be7e2b81]

lxhgww 在树上玩耍时，LZX2019 走了过来。lxhgww 突然问道：“我现在的k级祖先是谁？”  
LZX2019 答道：“不是我吗？”。接着 lxhgww 就用教主之力让 LZX2019 消失了，现在他转过头准备向你求助。

长链剖分，预处理出倍增数组，每一个点所属链链顶，和每一个链顶向上向下各$len$长的点，以及每一个数的最高位$1$。跳的时候，先跳最高位一，因为是长链剖分，可以保证接下来的$k'$级祖先在其链顶的$len$范围内，直接查询就好了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=301000;
const int maxM=maxN<<1;
const int maxBit=20;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Fa[maxBit][maxN],Depth[maxN],Hson[maxN],MxD[maxN],Top[maxN];
vector<int> Up[maxN],Down[maxN];
int HighBit[maxN];

int Input();
void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int top);
int Query(int u,int k);

int main(){
	HighBit[1]=0;
	for (int i=2;i<maxN;i++) HighBit[i]=HighBit[i>>1]+1;
	mem(Head,-1);
	
	n=Input();
	for (int i=1;i<n;i++){
		int u=Input(),v=Input();
		Add_Edge(u,v);Add_Edge(v,u);
	}
	Depth[1]=1;dfs1(1,1);dfs2(1,1);

	for (int i=1;i<=n;i++)
		if (Top[i]==i){
			int len=MxD[i]-Depth[i]+1;
			for (int j=Fa[0][i],k=1;(j!=0)&&(k<=len);j=Fa[0][j],k++) Up[i].push_back(j);
			for (int j=Hson[i],k=1;k<=len;j=Hson[j],k++) Down[i].push_back(j);
		}

	int Q=Input(),lastans=0;
	while (Q--){
		int u=Input(),k=Input();
		u^=lastans;k^=lastans;
		printf("%d\n",lastans=Query(u,k));
	}

	return 0;
}

int Input(){
	int x=0;char ch=getchar();
	while ((ch>'9')||(ch<'0')) ch=getchar();
	while ((ch>='0')&&(ch<='9')) x=x*10+ch-48,ch=getchar();
	return x;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	for (int i=1;i<maxBit;i++)
		if (Fa[i-1][u]) Fa[i][u]=Fa[i-1][Fa[i-1][u]];
		else break;
	MxD[u]=Depth[u];
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Depth[V[i]]=Depth[u]+1;Fa[0][V[i]]=u;
			dfs1(V[i],u);
			if (MxD[V[i]]>MxD[u]) Hson[u]=V[i],MxD[u]=MxD[V[i]];
		}
	return;
}

void dfs2(int u,int top){
	Top[u]=top;
	if (Hson[u]==0) return;
	dfs2(Hson[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[0][u])&&(V[i]!=Hson[u]))
			dfs2(V[i],V[i]);
	return;
}

int Query(int u,int k){
	if (Depth[u]<=k) return 0;
	if (k==0) return u;
	u=Fa[HighBit[k]][u];k-=(1<<HighBit[k]);
	if (k==0) return u;
	int len=Depth[u]-Depth[Top[u]];
	if (len==k) return Top[u];
	else if (len>k) return Down[Top[u]][len-k-1];
	else return Up[Top[u]][k-len-1];
}
```