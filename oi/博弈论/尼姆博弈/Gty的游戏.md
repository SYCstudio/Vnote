# Gty的游戏
[BZOJ3729]

某一天gty在与他的妹子玩游戏。  
妹子提出一个游戏，给定一棵有根树，每个节点有一些石子，每次可以将不多于L的石子移动到父节点，询问将某个节点的子树中的石子移动到这个节点先手是否有必胜策略。  
gty很快计算出了策略。  
但gty的妹子十分机智，她决定修改某个节点的石子或加入某个新节点。  
gty不忍心打击妹子，所以他将这个问题交给了你。  
另外由于gty十分绅士，所以他将先手让给了妹子。

树上阶梯博弈+Nim-Bash 博弈，那么首先将所有的石子数模 (L+1)，然后对于以某一个点为根的时候，子树中深度的奇偶性不同的点的异或和就是阶梯博弈的 Nim 和。用 Splay 维护欧拉序列，维护奇偶两个异或和。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<map>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=501000;
const int inf=2147483647;

class SplayData
{
public:
	int fa,ch[2],opt,key;
	int sum0,sum1;
};

int n,m,L,root,Stone[maxN];
vector<int> To[maxN];
SplayData S[maxN];
int dfncnt,dfn[maxN],lst[maxN],Qn[maxN];
map<int,int> Id;

void dfs(int u,int fa,int opt);
void Update(int x);
void Rotate(int x);
void Splay(int x,int goal);
int Prev(int x);

int main(){
	scanf("%d%d",&n,&L);
	for (int i=1;i<=n;i++) scanf("%d",&Stone[i]),Id[i]=i,Stone[i]%=(L+1);
	for (int i=1;i<n;i++){
		int u,v;scanf("%d%d",&u,&v);
		To[u].push_back(v);To[v].push_back(u);
	}

	dfs(1,1,1);

	root=1;
	for (int i=2;i<=dfncnt;i++) S[i].fa=i-1;
	for (int i=1;i<dfncnt;i++) S[i].ch[1]=i+1;
	
	Splay(dfncnt,0);

	int lastans=0;
	scanf("%d",&m);
	while (m--){
		int opt;scanf("%d",&opt);
		if (opt==1){
			int u;scanf("%d",&u);u^=lastans;u=Id[u];
			Splay(dfn[u],0);Splay(lst[u],dfn[u]);
			int key=(S[dfn[u]].opt==1)?(S[S[lst[u]].ch[0]].sum0):(S[S[lst[u]].ch[0]].sum1);
			if (key==0) printf("GTY\n");
			else printf("MeiZ\n"),lastans++;
		}
		if (opt==2){
			int u,key;scanf("%d%d",&u,&key);u^=lastans;key^=lastans;u=Id[u];key%=(L+1);
			Splay(dfn[u],0);S[dfn[u]].key=key;Update(dfn[u]);
		}
		if (opt==3){
			int u,v,key;scanf("%d%d%d",&u,&v,&key);u^=lastans;v^=lastans;key^=lastans;u=Id[u];key%=(L+1);
			Id[v]=++n;v=n;
			dfn[v]=++dfncnt;lst[v]=++dfncnt;
			int prev=Prev(lst[u]);
			Splay(prev,0);Splay(lst[u],prev);

			S[dfn[v]].opt=S[dfn[u]].opt^1;S[dfn[v]].key=key;
			S[dfn[v]].fa=lst[u];S[lst[u]].ch[0]=dfn[v];
			S[dfn[v]].ch[1]=lst[v];S[lst[v]].fa=dfn[v];
			Splay(lst[v],0);
		}
	}

	return 0;
}

void dfs(int u,int fa,int opt){
	Qn[dfn[u]=++dfncnt]=u;S[dfncnt].opt=opt;S[dfncnt].key=Stone[u];
	for (int i=0,sz=To[u].size();i<sz;i++)
		if (To[u][i]!=fa) dfs(To[u][i],u,opt^1);
	Qn[lst[u]=++dfncnt]=-u;return;
}

void Update(int x){
	S[x].sum0=S[S[x].ch[0]].sum0^S[S[x].ch[1]].sum0;
	S[x].sum1=S[S[x].ch[0]].sum1^S[S[x].ch[1]].sum1;
	if (S[x].opt==0) S[x].sum0^=S[x].key;
	else S[x].sum1^=S[x].key;
	return;
}

void Rotate(int x){
	int y=S[x].fa,z=S[y].fa;
	int sx=(x==S[y].ch[1]),sy=(y==S[z].ch[1]);
	S[x].fa=z;if (z) S[z].ch[sy]=x;
	S[y].ch[sx]=S[x].ch[sx^1];if (S[x].ch[sx^1]) S[S[x].ch[sx^1]].fa=y;
	S[x].ch[sx^1]=y;S[y].fa=x;
	Update(y);return;
}

void Splay(int x,int goal){
	while (S[x].fa!=goal){
		int y=S[x].fa,z=S[y].fa;
		if (z!=goal)
			((x==S[y].ch[0])^(y==S[z].ch[0]))?(Rotate(x)):(Rotate(y));
		Rotate(x);
	}
	Update(x);
	if (goal==0) root=x;
	return;
}

int Prev(int x){
	Splay(x,0);
	x=S[x].ch[0];
	while (S[x].ch[1]) x=S[x].ch[1];
	return x;
}
```