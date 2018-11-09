# [HEOI2013]Eden 的博弈树
[BZOJ3164 Luogu4096]

对于有两个玩家的，状态透明且状态转移确定的博弈游戏，博弈树是常用的 分析工具。博弈树是一棵有根树，其中的节点为游戏的状态。若节点 B 的父亲是 A，则说明状态 A 能通过一次决策转移到状态 B。每个状态都有一个唯一的决策 方，即这个状态下应该由哪一方做出决策。我们规定双方在任何时候都是轮流做 出决策的，即树上相邻节点的决策方总是不相同的  
在这个问题中，我们只关心两个玩家的胜负情况，且规定游戏不会出现平局  
我们称两个玩家分别为黑方和白方，其中根节点的决策方为黑方。显然每个节点 只有两个状态：黑方胜和白方胜。若某内节点（即存在后继节点的节点）的决策 方为黑方，则该节点为黑方胜的充要条件为它的儿子中存在黑方胜的节点，反之 亦然。求解博弈树即为判明博弈树根节点的状态  
如果我们得知了所有叶节点（即无后继节点的节点）的状态，那么博弈树就 很容易求解了。但是现在的情况是所有叶节点的状态均为未知的，需要进一步的 计算。对于一个由叶节点构成的集合 S，如果 S 中的节点均被判明为黑方胜，就 可以断言根节点为黑方胜的话，则称 S 为一个黑方胜集合。对于黑方胜集合 S， 如果对于任意的黑方胜集合 S’ 均满足|S| ≤ |S’ |（|S|表示集合 S 中的元素数目）， 则称 S 为一个最小黑方胜集合。同样地，也可以定义白方胜集合和最小白方胜集合 Eden 最近在研究博弈树问题。他发现，如果一个叶节点既属于某一个最小 黑方胜集合，又属于一个最小白方胜集合，那么求解这个节点的状态显然最有益 于求解根节点的状态。像这样的叶节点就称之为关键叶节点。对于一棵给定的博 弈树，Eden 想要知道哪些叶节点是关键叶节点

对于两种决策，分别记录子树的和与最小值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=202000;
const int maxM=maxN;
const int inf=2147483647;

int n;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int F[maxN],Mk[maxN];

void Add_Edge(int u,int v);
void dfs(int u,int opt);
void cov(int u,int opt);

int main(){
	mem(Head,-1);
	scanf("%d",&n);
	for (int i=2;i<=n;i++){
		int fa;scanf("%d",&fa);
		Add_Edge(fa,i);
	}
	dfs(1,1);cov(1,1);
	dfs(1,0);cov(1,0);
	int id=0,cnt=0,sum=0;
	for (int i=n;i>=1;i--) if (Mk[i]==2) id=i,++cnt,sum^=i;
	printf("%d %d %d\n",id,cnt,sum);
	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs(int u,int opt){
	if (Head[u]==-1){
		F[u]=1;return;
	}
	if (opt) F[u]=inf;
	else F[u]=0;
	for (int i=Head[u];i!=-1;i=Next[i]){
		dfs(V[i],opt^1);
		if (opt) F[u]=min(F[u],F[V[i]]);
		else F[u]+=F[V[i]];
	}
	return;
}

void cov(int u,int opt){
	if (Head[u]==-1){
		++Mk[u];return;
	}
	if (opt) for (int i=Head[u];i!=-1;i=Next[i]) if (F[V[i]]==F[u]) cov(V[i],opt^1); else;
	else for (int i=Head[u];i!=-1;i=Next[i]) cov(V[i],opt^1);
	return;
}
```