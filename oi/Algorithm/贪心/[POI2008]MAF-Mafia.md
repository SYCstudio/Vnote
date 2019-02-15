# [POI2008]MAF-Mafia
[BZOJ1124 Luogu3472]

Mob feud rages in Equatorial Byteotia. The mob bosses have come to the country's capital, Byteburg, to settle the dispute.  
Negotiations were very tense, and at one point the trigger-happy participants drew their guns.  
Each participant aims at another with a pistol.  
Should they go on a killing spree, the shooting will go in accordance with the following code of honour:  
the participants shoot in a certain order, and at any moment at most one of them is shooting, no shooter misses, his target dies instantly, hence he may not shoot afterwards, everyone shoots once, provided he had not been shot before he has a chance to shoot, no participant may change his first target of choice, even if the target is already dead (then the shot causes no further casualties).  
An undertaker watches from afar, as he usually does. After all, the mobsters have never failed to stimulate his business.  
He sees potential profit in the shooting, but he would like to know tight estimations. Precisely he would like to know the minimum and maximum possible death rate.  
The undertaker sees who aims at whom, but does not know the order of shooting.  
You are to write a programme that determines the numbers he is so keen to know.  
Task Write a programme that:  
reads from the standard input what target each mobster has chosen, determines the minimum and maximum number of casualties, writes out the result to the standard output.  
给定n个神枪手，每个神枪手瞄准一个人，以一定顺序开枪，问最少和最多死多少人

由于每一个人只会有一个出度，那么可以发现图是若干基环外向树和若干单独的环组成的，并且基环树上的非环部分一定指向环上。最少的人死，那就按照拓扑序的顺序开枪，依次判断，最后再把剩下的环单独拿出来判。最多的人死，那就是对于基环外向树，只留下入度为 $0$ 的点，因为必然能够找到一种方式使得只剩下这些人。对于单独是环的，可以发现存在方案使得环上面只留下一个人。最后再特殊判断一下自环。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int inf=2147483647;

int n,Fa[maxN],Dg[maxN],Dgg[maxN];
bool vis[maxN],alive[maxN];
queue<int> Q;
int mxd,cnt,Ans1,Ans2;

void dfs(int u);

int main(){
	scanf("%d",&n);
	Ans1=0;Ans2=n;
	for (int i=1;i<=n;i++){
		scanf("%d",&Fa[i]);Dg[Fa[i]]++;
	}
	for (int i=1;i<=n;i++) Dgg[i]=Dg[i],alive[i]=1;

	for (int i=1;i<=n;i++) if (Dg[i]==0) Q.push(i),Ans2--;
	while (!Q.empty()){
		int u=Q.front();Q.pop();
		int v=Fa[u];
		if (alive[u]){
			if (alive[v]) Ans1++,alive[v]=0;
			if (Dg[v]) Dg[v]=0,Q.push(v);
		}
		else{
			if (Dg[v]){
				Dg[v]--;
				if (Dg[v]==0) Q.push(v);
			}
		}
	}
	for (int i=1;i<=n;i++)
		if ((Dg[i]!=0)&&(vis[i]==0)){
			mxd=0;cnt=0;
			dfs(i);
			if ((mxd==1)&&(cnt>1)) Ans2--;
		}
	printf("%d %d\n",Ans1,Ans2);
	return 0;
}

void dfs(int u){
	if (vis[u]) return;
	vis[u]=1;cnt++;
	mxd=max(mxd,Dgg[u]);
	if (alive[u]) alive[Fa[u]]=0,Ans1++;
	dfs(Fa[u]);
	return;
}
```