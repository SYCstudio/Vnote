# JC的小苹果
[BZOJ3640]

让我们继续JC和DZY的故事。  
“你是我的小丫小苹果，怎么爱你都不嫌多！”  
“点亮我生命的火，火火火火火！”  
话说JC历经艰辛来到了城市B，但是由于他的疏忽DZY偷走了他的小苹果！没有小苹果怎么听歌！他发现邪恶的DZY把他的小苹果藏在了一个迷宫里。JC在经历了之前的战斗后他还剩下hp点血。开始JC在1号点，他的小苹果在N号点。DZY在一些点里放了怪兽。当JC每次遇到位置在i的怪兽时他会损失Ai点血。当JC的血小于等于0时他就会被自动弹出迷宫并且再也无法进入。  
但是JC迷路了，他每次只能从当前所在点出发等概率的选择一条道路走。所有道路都是双向的，一共有m条，怪兽无法被杀死。现在JC想知道他找到他的小苹果的概率。

容易想到一个 $O((n\times hp)^3)$ 的高斯消元，即设 F[i][j] 表示在点 i ，血量为 j 的概率。由于存在消耗为 0 的点，所以这个方程的转移是存在环的，所以需要采用高斯消元的方法。注意到每次血量是单调不增的，所以可以分层高斯消元，做到 $O(hp\times n^3)$ 。  
但是这样还不够。观察到分层高斯消元的时候，每一个未知数前面的系数是不变的而右边的系数是变化的，那么不妨对右边建立增广矩阵 C ，初始化为一个单位矩阵表示每一个方程的系数；把左边矩阵消成单位矩阵后，就可以得到左边的每一个未知数为右边系数的多项式，这样就可以一层一层从上往下做了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=160;
const int maxM=5010<<1;
const int maxHP=10100;
const ld eps=1e-10;
const int inf=2147483647;

int n,m,HP;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],Dft[maxN],Dg[maxN];
ld M1[maxN][maxN],M2[maxN][maxN],Ans[maxN][maxHP],C[maxN];

void Add_Edge(int u,int v);

int main(){
	mem(Head,-1);scanf("%d%d%d",&n,&m,&HP);
	for (int i=1;i<=n;i++) scanf("%d",&Dft[i]);
	for (int i=1;i<=m;i++){
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);if (u!=v) Add_Edge(v,u);
	}
	for (int i=1;i<=n;i++){
		M1[i][i]=1.0;M2[i][i]=1.0;
		if (Dft[i]==0)
			for (int j=Head[i];j!=-1;j=Next[j])
				if (V[j]!=n) M1[i][V[j]]-=1.0/Dg[V[j]];
	}
	for (int i=1;i<=n;i++){
		int now=i;
		for (int j=i+1;j<=n;j++) if (fabs(M1[j][i])>fabs(M1[now][i])) now=j;
		if (now!=i) swap(M1[i],M1[now]),swap(M2[i],M2[now]);
		ld d=1.0/M1[i][i];
		for (int j=1;j<=n;j++) M1[i][j]=M1[i][j]*d,M2[i][j]=M2[i][j]*d;
		for (int j=1;j<=n;j++)
			if ((j!=i)&&(fabs(M1[j][i])>eps)){
				d=M1[j][i];
				for (int k=1;k<=n;k++) M1[j][k]=M1[j][k]-d*M1[i][k],M2[j][k]=M2[j][k]-d*M2[i][k];
			}
	}
	ld ans=0;
	for (int h=HP;h>=1;h--){
		mem(C,0);if (h==HP) C[1]=1;
		for (int i=1;i<=n;i++)
			if ((Dft[i]!=0)&&(Dft[i]+h<=HP))
				for (int j=Head[i];j!=-1;j=Next[j])
					if (V[j]!=n) C[i]+=Ans[V[j]][Dft[i]+h]/Dg[V[j]];
		for (int i=1;i<=n;i++) for (int j=1;j<=n;j++) Ans[i][h]+=M2[i][j]*C[j];
		ans+=Ans[n][h];
	}
	printf("%.8LF\n",ans);return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;++Dg[u];
	return;
}
```